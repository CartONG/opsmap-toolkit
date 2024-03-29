import { TKFDFInfos } from "@/domain/fdf/TKFDFInfos";
import {
  TKFDFSubmissionItemType,
  TKFDFSubmissionsRulesCollection
} from "@/domain/fdf/TKFDFSubmissionsRules";
import { TKCSVParse } from "@/secondary/csv/TKCSV";
import {
  TKOperatorComparison,
  TKOperatorComputation
} from "@/domain/utils/TKOperator";
import { TKFDFFiles } from "@/secondary/fdf/TKFDFInfos";

// ////////////////////////////////////////////////////////////////////////////
// Submission rules datatype
// ////////////////////////////////////////////////////////////////////////////

interface TKFDFSubmissionRuleRaw {
  field_name: string;
  type: TKFDFSubmissionItemType;
  thematic_group: string;
  traffic_light_name: string;
  chart_id: string;
  chart_data: string;
  display_condition: string;
  computed_rule: string;
}

// ////////////////////////////////////////////////////////////////////////////
// Submission rules collection reading
// ////////////////////////////////////////////////////////////////////////////

export async function TKReadSubmissionsRulesCollection(
  infos: TKFDFInfos
): Promise<TKFDFSubmissionsRulesCollection> {
  const rawSubmissionsRules: TKFDFSubmissionRuleRaw[] = await TKCSVParse<
    TKFDFSubmissionRuleRaw[]
  >(
    `${process.env.BASE_URL}/${infos.folder}/${TKFDFFiles.SUBMISSION_RULES}.csv`,
    true
  );
  const submissionsRules: TKFDFSubmissionsRulesCollection = {};
  rawSubmissionsRules.map(item => {
    // Parse computed rule and condition
    let displayCondition = undefined;
    if (item.display_condition) {
      if (item.display_condition === "hide") {
        displayCondition = {
          field: "hack to have false value",
          operator: "hack again",
          value: "hack again"
        };
      } else {
        const condition = item.display_condition.split("#");
        if (condition.length === 3) {
          displayCondition = {
            field: condition[0],
            operator: condition[1],
            value: condition[2]
          };
        }
      }
    }

    let computedRule = undefined;
    if (item.type === TKFDFSubmissionItemType.COMPUTED) {
      const rule = item.computed_rule.split("#");
      if (rule.length === 3) {
        computedRule = {
          field1: rule[0],
          operator: rule[1],
          field2: rule[2]
        };
      }
    }

    submissionsRules[item.field_name] = {
      fieldName: item.field_name,
      type: item.type,
      thematicGroup: item.thematic_group,
      trafficLightName: item.traffic_light_name,
      chartId: item.chart_id,
      chartData: item.chart_data,
      displayCondition: displayCondition
        ? {
            field: displayCondition.field,
            value: displayCondition.value,
            operator: displayCondition.operator as TKOperatorComparison
          }
        : undefined,
      computed: computedRule
        ? {
            field1: computedRule.field1,
            field2: computedRule.field2,
            operator: computedRule.operator as TKOperatorComputation
          }
        : undefined
    };
  });
  return submissionsRules;
}
