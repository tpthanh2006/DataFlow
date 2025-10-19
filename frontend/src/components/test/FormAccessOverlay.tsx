import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import {
  X,
  Users,
  Plus,
  ChevronDown,
  CheckCircle,
  ChevronRight,
  Search,
} from "lucide-react";
import { selectUser } from "@/state/auth/authSlice";
import {
  useStaffUsers,
  useUserGroups,
  type UserGroup,
} from "@/hooks/getStaffUsers";
import { useFormAccess } from "@/hooks/formAccess";
import type { FormAccessUpdateRequest } from "@/hooks/formAccess";
import type { Form } from "@shared/types/formTypes";

// Real user data will be fetched from Supabase user_groups table

interface FormAccessOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  form: Form;
  onAccessUpdate: (formId: string, accessData: FormAccessUpdateRequest) => void;
}

/**
 * Form Access Management Overlay Component
 * Based on the Figma design for managing form access permissions
 */
export const FormAccessOverlay = ({
  isOpen,
  onClose,
  form,
  onAccessUpdate,
}: FormAccessOverlayProps) => {
  // Get current user information
  const currentUser = useSelector(selectUser);

  // Fetch real staff users and groups from Supabase
  const { data: allUsers = [], refetch: refetchUsers } = useStaffUsers();
  const { data: supabaseGroups = [], refetch: refetchGroups } = useUserGroups();
  const { data: formAccessData, refetch: refetchFormAccess } = useFormAccess(
    form.id,
  );

  // Log user information for debugging
  console.log("🔍 Current User ID:", currentUser?.id);
  console.log("🔍 Current User:", currentUser);
  console.log("🔍 Staff Users from Supabase:", allUsers);
  console.log("🔍 Groups from Supabase:", supabaseGroups);

  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [searchTerm] = useState("");
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [isGroupSelectOpen, setIsGroupSelectOpen] = useState(false);
  const [memberSearchTerms, setMemberSearchTerms] = useState<
    Record<string, string>
  >({});
  const [isMemberSelectOpen, setIsMemberSelectOpen] = useState<
    Record<string, boolean>
  >({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  // Track if we're currently refetching
  const [isRefetching, setIsRefetching] = useState(false);
  // Track save success message
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Track initial groups to detect changes
  const [initialGroups, setInitialGroups] = useState<UserGroup[]>([]);

  // Refetch data when overlay opens
  useEffect(() => {
    const handleRefetch = async () => {
      if (isOpen) {
        console.log("🔄 Refetching data when FormAccessOverlay opens");
        setIsRefetching(true);
        try {
          await Promise.all([
            refetchUsers(),
            refetchGroups(),
            refetchFormAccess(),
          ]);
        } finally {
          setIsRefetching(false);
        }
      }
    };

    handleRefetch();
  }, [isOpen, refetchUsers, refetchGroups, refetchFormAccess]);

  // Load groups from form access data when it's fetched
  useEffect(() => {
    if (formAccessData) {
      console.log("📋 Loading groups from form access data:", formAccessData);
      // Convert form access data to UserGroup format
      const groupsWithAccess = formAccessData.user_groups_with_access.map(
        (group) => ({
          group_name: group.group_name,
          group_description: group.group_description,
          user_emails: group.user_emails,
        }),
      );
      setGroups(groupsWithAccess);
      setInitialGroups(groupsWithAccess); // Store initial state for change detection
    } else {
      // If no form access data, start with empty groups
      console.log("📋 No form access data found, starting with empty groups");
      setGroups([]);
      setInitialGroups([]);
    }
  }, [formAccessData]);

  // Filter groups based on search
  const filteredGroups = groups.filter((group) =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get available groups that are not already added to this form
  // Since we load all groups by default, this will be empty unless groups are removed
  const getAvailableGroups = () => {
    return supabaseGroups.filter(
      (supabaseGroup) =>
        !groups.some(
          (currentGroup) =>
            currentGroup.group_name === supabaseGroup.group_name,
        ),
    );
  };

  // Filter available groups based on search term
  const filteredAvailableGroups = getAvailableGroups().filter(
    (group) =>
      group.group_name.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
      group.group_description
        .toLowerCase()
        .includes(groupSearchTerm.toLowerCase()),
  );

  // Handle adding a group from available groups
  const handleAddGroup = (groupToAdd: UserGroup) => {
    setGroups([...groups, groupToAdd]);
    setGroupSearchTerm("");
    setIsGroupSelectOpen(false);
    setIsAddingGroup(false);
  };

  // Handle removing a group
  const handleRemoveGroup = (groupName: string) => {
    setGroups(groups.filter((group) => group.group_name !== groupName));
  };

  // Handle adding member to group
  const handleAddMemberToGroup = (groupName: string, userEmail: string) => {
    setGroups(
      groups.map((group) => {
        if (group.group_name === groupName) {
          return {
            ...group,
            user_emails: [...group.user_emails, userEmail],
          };
        }
        return group;
      }),
    );
    // Clear search term and close popover
    setMemberSearchTerms((prev) => ({ ...prev, [groupName]: "" }));
    setIsMemberSelectOpen((prev) => ({ ...prev, [groupName]: false }));
  };

  // Get available users for a group (users not already in the group)
  const getAvailableUsers = (groupName: string) => {
    const group = groups.find((g) => g.group_name === groupName);
    if (!group) return [];

    const searchTerm = memberSearchTerms[groupName] || "";
    return allUsers
      .filter((user) => !group.user_emails.includes(user.email))
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  };

  // Check if changes were made
  const hasChanges = () => {
    if (initialGroups.length !== groups.length) return true;

    // Check if any group was added or removed
    const initialGroupNames = initialGroups.map((g) => g.group_name).sort();
    const currentGroupNames = groups.map((g) => g.group_name).sort();

    return (
      JSON.stringify(initialGroupNames) !== JSON.stringify(currentGroupNames)
    );
  };

  // Handle saving access changes
  const handleSaveAccess = () => {
    const accessData = {
      groups: groups.map((group) => ({
        group_name: group.group_name,
        group_description: group.group_description,
        user_emails: group.user_emails,
        hasAccess: true, // All groups have access by default
      })),
    };

    console.log("💾 Saving form access for form:", form.id);
    console.log("💾 Access data being saved:", accessData);
    console.log("💾 Number of groups:", groups.length);

    onAccessUpdate(form.id, accessData);

    // Only show success message if there were actual changes
    if (hasChanges()) {
      setSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[96vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Access - {form.name}
          </DialogTitle>
        </DialogHeader>

        {/* Show loading state when refetching */}
        {isRefetching && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <p className="text-muted-foreground">Refreshing data...</p>
            </div>
          </div>
        )}

        {!isRefetching && (
          <div className="space-y-6">
            {/* Description */}
            <div className="text-sm text-muted-foreground">
              Configure users who have access to filling the form.
            </div>

            {/* Groups List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Groups</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingGroup(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add group
                </Button>
              </div>

              {/* Add Group Search-Select */}
              {isAddingGroup && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="text-sm font-medium">
                        Add group to form access
                      </div>
                      <Popover
                        open={isGroupSelectOpen}
                        onOpenChange={setIsGroupSelectOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Search className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {groupSearchTerm ||
                                  "Search and select group..."}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <div className="p-2">
                            <Input
                              placeholder="Search groups by name or description..."
                              value={groupSearchTerm}
                              onChange={(e) =>
                                setGroupSearchTerm(e.target.value)
                              }
                              className="mb-2"
                            />
                            <div className="max-h-60 overflow-auto">
                              {filteredAvailableGroups.length > 0 ? (
                                filteredAvailableGroups.map((group) => (
                                  <div
                                    key={group.group_name}
                                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                                    onClick={() => handleAddGroup(group)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleAddGroup(group);
                                      }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="font-medium text-sm">
                                          {group.group_name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {group.group_description}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {group.user_emails.length} members
                                        </div>
                                      </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                ))
                              ) : (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                  {groupSearchTerm
                                    ? "No groups found"
                                    : "All groups already have access to this form"}
                                </div>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAddingGroup(false);
                            setGroupSearchTerm("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Groups List */}
              <div className="space-y-2">
                {filteredGroups.map((group) => (
                  <Card key={group.group_name}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setExpandedGroups((prev) => ({
                                ...prev,
                                [group.group_name]: !prev[group.group_name],
                              }));
                            }}
                            className="p-1 h-auto"
                          >
                            {expandedGroups[group.group_name] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <h4 className="font-medium">{group.group_name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {group.user_emails.length} members
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Has Access
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveGroup(group.group_name)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Group Members - Collapsible */}
                      {expandedGroups[group.group_name] && (
                        <div className="space-y-2">
                          {group.user_emails.map((email: string) => {
                            const user = allUsers.find(
                              (u) => u.email === email,
                            );
                            const displayName =
                              user?.name ||
                              email
                                .split("@")[0]
                                .replace(/[._]/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase());
                            return (
                              <div
                                key={email}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div>
                                  <div className="font-medium text-sm">
                                    {displayName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {email}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Add Member to Group - Search Select */}
                          <div className="pt-2">
                            <Popover
                              open={
                                isMemberSelectOpen[group.group_name] || false
                              }
                              onOpenChange={(open) =>
                                setIsMemberSelectOpen((prev) => ({
                                  ...prev,
                                  [group.group_name]: open,
                                }))
                              }
                            >
                              <PopoverTrigger asChild></PopoverTrigger>
                              <PopoverContent
                                className="w-full p-0"
                                align="start"
                              >
                                <div className="p-2">
                                  <Input
                                    placeholder="Search users..."
                                    value={
                                      memberSearchTerms[group.group_name] || ""
                                    }
                                    onChange={(e) =>
                                      setMemberSearchTerms((prev) => ({
                                        ...prev,
                                        [group.group_name]: e.target.value,
                                      }))
                                    }
                                    className="mb-2"
                                  />
                                  <div className="max-h-60 overflow-auto">
                                    {getAvailableUsers(group.group_name)
                                      .length > 0 ? (
                                      getAvailableUsers(group.group_name).map(
                                        (user) => (
                                          <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                                            onClick={() =>
                                              handleAddMemberToGroup(
                                                group.group_name,
                                                user.email,
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                              ) {
                                                e.preventDefault();
                                                handleAddMemberToGroup(
                                                  group.group_name,
                                                  user.email,
                                                );
                                              }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                          >
                                            <div>
                                              <div className="font-medium text-sm">
                                                {user.name}
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                {user.email}
                                              </div>
                                            </div>
                                            <Plus className="h-4 w-4 text-muted-foreground" />
                                          </div>
                                        ),
                                      )
                                    ) : (
                                      <div className="p-2 text-sm text-muted-foreground text-center">
                                        {memberSearchTerms[group.group_name]
                                          ? "No users found"
                                          : "No available users"}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Access updated successfully!
                  </span>
                </div>
              )}
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSaveAccess}>Save Changes</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
