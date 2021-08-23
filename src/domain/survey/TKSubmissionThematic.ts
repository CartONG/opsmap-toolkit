import { TKFDFThematic } from "@/domain/fdf/TKFDFThematics";
import { TKLabel } from "../ui/TKLabel";
import { TKSubmissionEntry } from "./TKSubmissionEntry";

// ////////////////////////////////////////////////////////////////////////////
// TKSubmissionThematic Concept description.
// ////////////////////////////////////////////////////////////////////////////

export interface TKSubmissionThematic {
  data: Array<TKSubmissionEntry>;
  formattedName: string;
  iconFileName: string;
  nameLabel: TKLabel;
}

// ////////////////////////////////////////////////////////////////////////////
// TKSubmissionThematic Creation
// ////////////////////////////////////////////////////////////////////////////

export function TKCreateSubmissionThematic(
  thematic: TKFDFThematic
): TKSubmissionThematic {
  return {
    data: [],
    formattedName: thematic.formattedName,
    iconFileName: thematic.iconFileName,
    nameLabel: thematic.thematicLabel
  };
}
