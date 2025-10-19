import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Search,
  Users,
  X,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import {
  useStaffUsers,
  useUserGroups,
  saveUserGroups,
  type UserGroup,
} from "@/hooks/getStaffUsers";
import { Spinner } from "@/components/ui/Spinner";

// Start with empty groups - users will create their own groups

// Real user data will be fetched from Supabase isf_staff_emails table

/**
 * Staff User Groups Management Page
 * Allows admin users to manage groups and their members
 */
export const StaffUserGroups = () => {
  // Fetch real staff users and groups from Supabase
  const {
    data: allUsers = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useStaffUsers();
  const {
    data: supabaseGroups = [],
    isLoading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  } = useUserGroups();

  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [originalGroupName, setOriginalGroupName] = useState<string>("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });
  const [memberSearchTerms, setMemberSearchTerms] = useState<
    Record<string, string>
  >({});
  const [isMemberSelectOpen, setIsMemberSelectOpen] = useState<
    Record<string, boolean>
  >({});

  // Track if we're currently refetching
  const [isRefetching, setIsRefetching] = useState(false);
  // Track save success message
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  // Track validation errors
  const [nameError, setNameError] = useState<string>("");

  // Refetch data when component mounts (when switching to this tab)
  useEffect(() => {
    const handleRefetch = async () => {
      console.log("🔄 Refetching data on component mount");
      setIsRefetching(true);
      try {
        await Promise.all([refetchUsers(), refetchGroups()]);
      } finally {
        setIsRefetching(false);
      }
    };

    handleRefetch();
  }, [refetchUsers, refetchGroups]); // Include dependencies to avoid linting warning

  // Load groups from Supabase when they're fetched
  useEffect(() => {
    console.log("📋 Loading groups from Supabase:", supabaseGroups);
    setGroups(supabaseGroups);
  }, [supabaseGroups]);

  // Filter groups based on search
  const filteredGroups = groups.filter(
    (group) =>
      group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.group_description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Check if group name already exists
  const isGroupNameExists = (name: string, excludeGroupName?: string) => {
    return groups.some(
      (group) =>
        group.group_name.toLowerCase() === name.toLowerCase() &&
        group.group_name !== excludeGroupName,
    );
  };

  // Handle creating a new group
  const handleCreateGroup = () => {
    const trimmedName = newGroup.name.trim();

    // Clear previous error
    setNameError("");

    if (!trimmedName) {
      setNameError("Group name is required");
      return;
    }

    if (isGroupNameExists(trimmedName)) {
      setNameError("A group with this name already exists");
      return;
    }

    const group: UserGroup = {
      group_name: trimmedName,
      group_description: newGroup.description.trim(),
      user_emails: [],
    };
    setGroups([...groups, group]);
    setNewGroup({ name: "", description: "" });
    setIsCreateGroupOpen(false);
  };

  // Handle editing a group
  const handleEditGroup = (group: UserGroup) => {
    setEditingGroup(group);
    setOriginalGroupName(group.group_name); // Store original name for validation
    setIsEditGroupOpen(true);
    setNameError(""); // Clear any previous errors
  };

  // Handle updating a group
  const handleUpdateGroup = () => {
    if (!editingGroup) return;

    const trimmedName = editingGroup.group_name.trim();

    // Clear previous error
    setNameError("");

    if (!trimmedName) {
      setNameError("Group name is required");
      return;
    }

    // Check if the name has changed and if the new name already exists
    if (trimmedName !== originalGroupName && isGroupNameExists(trimmedName)) {
      setNameError("A group with this name already exists");
      return;
    }

    setGroups(
      groups.map((group) =>
        group.group_name === originalGroupName ? editingGroup : group,
      ),
    );
    setIsEditGroupOpen(false);
    setEditingGroup(null);
    setOriginalGroupName(""); // Clear original name
  };

  // Handle deleting a group
  const handleDeleteGroup = (groupName: string) => {
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

  // Handle removing member from group
  const handleRemoveMemberFromGroup = (
    groupName: string,
    userEmail: string,
  ) => {
    setGroups(
      groups.map((group) => {
        if (group.group_name === groupName) {
          return {
            ...group,
            user_emails: group.user_emails.filter(
              (email) => email !== userEmail,
            ),
          };
        }
        return group;
      }),
    );
  };

  // Handle saving changes to Supabase
  const handleSaveChanges = async () => {
    try {
      console.log("💾 Saving groups to Supabase:", groups);
      await saveUserGroups(groups);
      console.log("✅ Groups saved successfully!");

      // Show success message
      setSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("❌ Error saving groups:", error);
      // Optionally show an error message to the user
    }
  };

  // Show loading state
  if (usersLoading || groupsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-muted-foreground">
              {usersLoading
                ? "Loading staff users..."
                : "Loading user groups..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show refetching state
  if (isRefetching) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-muted-foreground">Refreshing data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (usersError || groupsError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">
              {usersError
                ? "Error loading staff users"
                : "Error loading user groups"}
            </p>
            <p className="text-sm text-muted-foreground">
              {(usersError || groupsError) instanceof Error
                ? (usersError || groupsError)?.message
                : "Unknown error occurred"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Staff User Groups</h1>
          <p className="text-muted-foreground mt-2">
            Manage staff groups and their members for form access control
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {allUsers.length} staff users available from Supabase
          </p>
        </div>
        <Button
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">{filteredGroups.length} groups</Badge>
          <Badge variant="outline">
            {groups.reduce(
              (total, group) => total + group.user_emails.length,
              0,
            )}{" "}
            total members
          </Badge>
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-4">
                  {groups.length === 0
                    ? "No groups have been created yet. Create your first group to get started."
                    : "No groups match your search criteria. Try adjusting your search term."}
                </p>
                {groups.length === 0 && (
                  <Button
                    onClick={() => setIsCreateGroupOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Group
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredGroups.map((group) => (
            <Card key={group.group_name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => {
                      setExpandedGroups((prev) => ({
                        ...prev,
                        [group.group_name]: !prev[group.group_name],
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedGroups((prev) => ({
                          ...prev,
                          [group.group_name]: !prev[group.group_name],
                        }));
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      {expandedGroups[group.group_name] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {group.group_name}
                        <Badge variant="secondary">
                          {group.user_emails.length} members
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.group_description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGroup(group);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.group_name);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedGroups[group.group_name] && (
                <CardContent>
                  {/* Group Members */}
                  <div className="space-y-2">
                    {group.user_emails.map((email: string) => {
                      const user = allUsers.find((u) => u.email === email);
                      const displayName =
                        user?.name ||
                        email
                          .split("@")[0]
                          .replace(/[._]/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase());
                      return (
                        <div
                          key={email}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {displayName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{displayName}</div>
                              <div className="text-sm text-muted-foreground">
                                {email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRemoveMemberFromGroup(
                                  group.group_name,
                                  email,
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Member to Group - Search Select */}
                    <div className="pt-2">
                      <Popover
                        open={isMemberSelectOpen[group.group_name] || false}
                        onOpenChange={(open) =>
                          setIsMemberSelectOpen((prev) => ({
                            ...prev,
                            [group.group_name]: open,
                          }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isMemberSelectOpen[group.group_name]}
                            className="w-full justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Search className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {memberSearchTerms[group.group_name] ||
                                  "Search and add member..."}
                              </span>
                            </div>
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <div className="p-2">
                            <Input
                              placeholder="Search users by name or email..."
                              value={memberSearchTerms[group.group_name] || ""}
                              onChange={(e) =>
                                setMemberSearchTerms((prev) => ({
                                  ...prev,
                                  [group.group_name]: e.target.value,
                                }))
                              }
                              className="mb-2"
                            />
                            <div className="max-h-60 overflow-auto">
                              {getAvailableUsers(group.group_name).length >
                              0 ? (
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
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                          <span className="text-sm font-medium text-blue-600">
                                            {user.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </span>
                                        </div>
                                        <div>
                                          <div className="font-medium text-sm">
                                            {user.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {user.email}
                                          </div>
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
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end items-center gap-3 mt-6">
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Changes saved successfully!
            </span>
          </div>
        )}
        <Button onClick={handleSaveChanges} size="lg">
          Save All Changes
        </Button>
      </div>

      {/* Create Group Dialog */}
      <Dialog
        open={isCreateGroupOpen}
        onOpenChange={(open) => {
          setIsCreateGroupOpen(open);
          if (!open) {
            setNameError(""); // Clear error when dialog closes
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-group-name" className="text-sm font-medium">
                Group Name
              </label>
              <Input
                id="new-group-name"
                placeholder="Enter group name"
                value={newGroup.name}
                onChange={(e) => {
                  setNewGroup({ ...newGroup, name: e.target.value });
                  setNameError(""); // Clear error when user starts typing
                }}
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && (
                <p className="text-sm text-red-600 mt-1">{nameError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="new-group-description"
                className="text-sm font-medium"
              >
                Description
              </label>
              <Input
                id="new-group-description"
                placeholder="Enter group description"
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateGroupOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog
        open={isEditGroupOpen}
        onOpenChange={(open) => {
          setIsEditGroupOpen(open);
          if (!open) {
            setNameError(""); // Clear error when dialog closes
            setOriginalGroupName(""); // Clear original name
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-group-name"
                  className="text-sm font-medium"
                >
                  Group Name
                </label>
                <Input
                  id="edit-group-name"
                  placeholder="Enter group name"
                  value={editingGroup.group_name}
                  onChange={(e) => {
                    setEditingGroup({
                      ...editingGroup,
                      group_name: e.target.value,
                    });
                    setNameError(""); // Clear error when user starts typing
                  }}
                  className={nameError ? "border-red-500" : ""}
                />
                {nameError && (
                  <p className="text-sm text-red-600 mt-1">{nameError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit-group-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Input
                  id="edit-group-description"
                  placeholder="Enter group description"
                  value={editingGroup.group_description}
                  onChange={(e) =>
                    setEditingGroup({
                      ...editingGroup,
                      group_description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditGroupOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateGroup}>Update Group</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Debug Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Groups Count:</strong> {groups.length}
                </p>
                <p>
                  <strong>Total Members:</strong>{" "}
                  {groups.reduce(
                    (total, group) => total + group.user_emails.length,
                    0,
                  )}
                </p>
                <p>
                  <strong>Search Term:</strong> "{searchTerm}"
                </p>
              </div>
              <div>
                <p>
                  <strong>Fetched Users Count:</strong> {allUsers.length}
                </p>
                <p>
                  <strong>Loading State:</strong>{" "}
                  {usersLoading ? "Loading..." : "Loaded"}
                </p>
                <p>
                  <strong>Error State:</strong>{" "}
                  {usersError ? "Error" : "No Error"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                All Fetched Users from Supabase:
              </h4>
              <div className="bg-gray-50 p-3 rounded max-h-60 overflow-auto">
                {allUsers.length > 0 ? (
                  <div className="space-y-1 text-xs">
                    {allUsers.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded"
                      >
                        <span className="font-mono text-gray-500">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{user.name}</span>
                        <span className="text-gray-600">({user.email})</span>
                        <span className="font-mono text-gray-400">
                          ID: {user.id}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No users fetched from Supabase
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">All Groups from Supabase:</h4>
              <div className="bg-gray-50 p-3 rounded max-h-60 overflow-auto">
                {groups.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {groups.map((group) => (
                      <div
                        key={group.group_name}
                        className="p-2 border rounded"
                      >
                        <div className="font-medium">{group.group_name}</div>
                        <div className="text-gray-600">
                          {group.group_description}
                        </div>
                        <div className="text-gray-500 mt-1">
                          Members: {group.user_emails.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No groups found</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
