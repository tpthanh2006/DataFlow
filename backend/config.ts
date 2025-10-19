import dotenv from "dotenv";
dotenv.config();

export const AIRTABLE_PAT = process.env.AIRTABLE_PAT as string;

// TODO: We should probably never use this-- we want to be more flexible than assuming
// that these bases always exist
export const FORM_BASES = {
  master: process.env.MASTER_DATA_BASE_ID as string,
  education: process.env.EDUCATION_BASE_ID as string,
  community: process.env.COMMUNITY_BASE_ID as string,
};

export const SUBMISSION_HISTORY_BASE_ID = process.env
  .SUBMISSION_HISTORY_BASE_ID as string;
