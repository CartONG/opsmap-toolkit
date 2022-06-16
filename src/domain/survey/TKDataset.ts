import { TKBoundaries } from "@/domain/survey/TKBoundaries";
import { TKSubmission } from "./TKSubmission";
import { TKCamp } from "@/domain/survey/TKCamp";
import { TKSurvey } from "./TKSurvey";

// ////////////////////////////////////////////////////////////////////////////
// Filters Concept description. Requires Comments !
// TODO : work on this : clarity, comments, etc.
// ////////////////////////////////////////////////////////////////////////////

// TODO : split level (survey -> camp and filter planned / spontaneous)

export enum TKAdminFilters {
  SURVEY = "survey",
  ADMIN1 = "admin1",
  ADMIN2 = "admin2",
  CAMP = "camp"
}

export type TKAdminFiltersTypes = string | boolean | null;

// ////////////////////////////////////////////////////////////////////////////
//
// ////////////////////////////////////////////////////////////////////////////

export class TKDataset {
  private _lastModification = "";

  // Dataset
  private _surveys: TKSurvey[];
  private _currentSurvey!: TKSurvey; // ! --> Disable'not defined in ctor error'

  // Selection state
  private _currentAdmin1: TKBoundaries | null = null;
  private _currentAdmin2: TKBoundaries | null = null;
  private _currentCamp: TKCamp | null = null;
  private _currentSubmission: TKSubmission | null = null;

  private _filteredAdmin1List: TKBoundaries[] = [];
  private _filteredAdmin2List: TKBoundaries[] = [];
  private _filteredCampsList: TKCamp[] = [];

  private _filteredTypedCampsList: TKCamp[] = [];

  private _typeSite: Record<
    string,
    {
      active: boolean;
    }
  > = {};

  private _filters: { [key in TKAdminFilters]: TKAdminFiltersTypes } = {
    survey: null,
    admin1: null,
    admin2: null,
    camp: null
  };
  private _levelToZoom: TKAdminFilters = TKAdminFilters.SURVEY;

  constructor(surveys: TKSurvey[]) {
    const before = Date.now();

    this._surveys = surveys;

    if (this._surveys.length > 0) {
      this.currentSurvey = this._surveys[0];
    }

    console.log(
      `Dataset filterer set up ${(Date.now() - before) / 1000} seconds.`
    );
  }
  // ////////////////////////////////////////////////////////////////////////////
  // Current Survey
  // ////////////////////////////////////////////////////////////////////////////

  public get surveys(): TKSurvey[] {
    return this._surveys;
  }

  public get lastModification(): string {
    return this._lastModification;
  }

  public get filteredAdmin1List(): TKBoundaries[] {
    return this._filteredAdmin1List;
  }

  public get filteredAdmin2List(): TKBoundaries[] {
    return this._filteredAdmin2List;
  }

  public get filteredCampsList(): TKCamp[] {
    return this._filteredCampsList;
  }

  public get filteredTypedCampsList(): TKCamp[] {
    return this._filteredTypedCampsList;
  }

  public get filters(): {
    [key in TKAdminFilters]: TKAdminFiltersTypes;
  } {
    return this._filters;
  }

  public get levelToZoom(): TKAdminFilters {
    return this._levelToZoom;
  }

  public get typeSite() {
    return this._typeSite;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Current Survey
  // ////////////////////////////////////////////////////////////////////////////

  setCurrentSurveyByName(name: string) {
    const survey = this._surveys.find(item => item.name === name);
    if (survey) {
      this.currentSurvey = survey;
    }
  }

  public get currentSurvey(): TKSurvey {
    return this._currentSurvey;
  }

  public set currentSurvey(survey: TKSurvey) {
    if (this._currentSurvey !== survey) {
      // Erase everything
      this._currentCamp = null;
      this._currentSubmission = null;
      this._currentAdmin2 = null;
      this._currentAdmin1 = null;
      this._filters[TKAdminFilters.CAMP] = null;
      this._filters[TKAdminFilters.ADMIN2] = null;
      this._filters[TKAdminFilters.ADMIN1] = null;
      this._levelToZoom = TKAdminFilters.SURVEY;

      this._currentSurvey = survey;

      this._typeSite = {};
      Object.keys(this._currentSurvey.fdf.siteTypes).map(index => {
        const item = this._currentSurvey.fdf.siteTypes[index];
        this._typeSite[item.formattedName] = {
          active: true
        };
      });

      this._lastModification = `survey=${this._currentSurvey.name}`;

      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Filter all
  // ////////////////////////////////////////////////////////////////////////////

  setTypedFilterValue(siteType: string, value: boolean) {
    // Update value
    if (this._typeSite[siteType]) {
      this._typeSite[siteType].active = value;
    }

    // Update filtered typed camps list
    this._filteredTypedCampsList = this._filteredCampsList.filter(item => {
      if (this._typeSite[item.type.formattedName]) {
        return this._typeSite[item.type.formattedName].active;
      }
      return false;
    });

    // Clear current camp if needed
    if (
      this._currentCamp &&
      !value &&
      this._currentCamp.type.formattedName === siteType
    ) {
      this._levelToZoom = this._currentAdmin2
        ? TKAdminFilters.ADMIN2
        : this._currentAdmin1
        ? TKAdminFilters.ADMIN1
        : TKAdminFilters.SURVEY;
      this._currentCamp = null;
      this._currentSubmission = null;
      this._filters[TKAdminFilters.CAMP] = null;
    }

    this._lastModification = `filter=${siteType}x${value}`;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change date
  // ////////////////////////////////////////////////////////////////////////////

  public get currentSubmission(): TKSubmission | null {
    return this._currentSubmission;
  }

  public set currentSubmission(submission: TKSubmission | null) {
    if (submission !== this._currentSubmission) {
      if (submission && this._currentCamp?.submissions.includes(submission)) {
        this._currentSubmission = submission;
      } else {
        this._currentSubmission = this._currentCamp?.submissions[0] ?? null;
      }
      this._lastModification = `submission=${this._currentSubmission?.date}`;
    }
  }

  setSubmissionByDate(date: string) {
    const submission = this._currentCamp?.submissions.find(
      submission => submission.date === date
    );

    this.currentSubmission = submission ?? null;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin1
  // ////////////////////////////////////////////////////////////////////////////

  public get currentAdmin1(): TKBoundaries | null {
    return this._currentAdmin1;
  }

  public set currentAdmin1(admin1: TKBoundaries | null) {
    if (admin1) {
      if (admin1 !== this._currentAdmin1) {
        this._currentAdmin1 = admin1;
        this._filters[TKAdminFilters.ADMIN1] = this._currentAdmin1.pcode;

        // Clear Current Admin
        this._filters[TKAdminFilters.ADMIN2] = null;
        this._currentAdmin2 = null;
        this._currentCamp = null;
        this._currentSubmission = null;
        this._filters[TKAdminFilters.CAMP] = null;

        this._levelToZoom = TKAdminFilters.ADMIN1;

        this._lastModification = `admin1=${this._currentAdmin1.pcode}`;
        this.updateFiltering();
      }
    } else {
      this._levelToZoom = TKAdminFilters.SURVEY;

      this._currentAdmin1 = null;
      this._filters[TKAdminFilters.ADMIN1] = null;

      this._currentAdmin2 = null;
      this._filters[TKAdminFilters.ADMIN2] = null;

      this._currentCamp = null;
      this._filters[TKAdminFilters.CAMP] = null;
      this._currentSubmission = null;

      this._lastModification = `clearAdmin1`;

      this.updateFiltering();
    }
  }

  setCurrentAdmin1ByName(admin1Name: string) {
    if (this.currentSurvey) {
      const admin1 = this._currentSurvey.boundaries.admin1.find(
        admin1 => admin1.name === admin1Name
      );
      this.currentAdmin1 = admin1 ?? null;
    } else {
      this.currentAdmin1 = null;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Admin2
  // ////////////////////////////////////////////////////////////////////////////

  public get currentAdmin2(): TKBoundaries | null {
    return this._currentAdmin2;
  }

  public set currentAdmin2(admin2: TKBoundaries | null) {
    if (admin2) {
      if (admin2 !== this._currentAdmin2) {
        this._currentAdmin2 = admin2;
        this._filters[TKAdminFilters.ADMIN2] = this._currentAdmin2.pcode;

        // Clear camp
        this._currentCamp = null;
        this._currentSubmission = null;
        this._filters[TKAdminFilters.CAMP] = null;

        // New admin2
        this._levelToZoom = TKAdminFilters.ADMIN2;
        const campAdmin2 = this._currentSurvey.camps.find(
          camp => camp.admin2.pcode === this._currentAdmin2?.pcode
        );
        if (campAdmin2) {
          this._currentAdmin1 = campAdmin2.admin1;
        }
        this._filters[TKAdminFilters.ADMIN1] = this._currentAdmin1
          ? this._currentAdmin1.pcode
          : null;

        this._lastModification = `admin2=${this._currentAdmin2.pcode}`;

        this.updateFiltering();
      }
    } else {
      this._levelToZoom = this._currentAdmin1
        ? TKAdminFilters.ADMIN1
        : TKAdminFilters.SURVEY;

      this._filters[TKAdminFilters.ADMIN1] = this._currentAdmin1
        ? this._currentAdmin1.pcode
        : null;

      this._currentAdmin2 = null;
      this._filters[TKAdminFilters.ADMIN2] = null;

      this._currentCamp = null;
      this._filters[TKAdminFilters.CAMP] = null;
      this._currentSubmission = null;

      this._lastModification = `clearAdmin2`;

      this.updateFiltering();
    }
  }

  setCurrentAdmin2ByName(admin2Name: string) {
    if (this._currentSurvey) {
      const admin2 = this._currentSurvey.boundaries.admin2.find(
        admin2 => admin2.name === admin2Name
      );
      this.currentAdmin2 = admin2 ?? null;
    } else {
      this.currentAdmin2 = null;
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Change Camp
  // ////////////////////////////////////////////////////////////////////////////

  setCurrentCampByName(campName: string) {
    if (this._currentSurvey) {
      const camp = this._currentSurvey.camps.find(
        camp => camp.name === campName
      );
      this.currentCamp = camp ?? null;
    } else {
      this.currentCamp = null;
    }
  }

  public get currentCamp(): TKCamp | null {
    return this._currentCamp;
  }

  public set currentCamp(camp: TKCamp | null) {
    if (camp) {
      if (this._currentCamp !== camp) {
        this._currentCamp = camp;

        this._filters[TKAdminFilters.CAMP] = this._currentCamp.id;
        this._levelToZoom = TKAdminFilters.CAMP;
        if (this._currentCamp && this._currentSurvey) {
          if (this._currentCamp.admin1 !== this._currentAdmin1) {
            this._currentAdmin1 = this._currentCamp.admin1;
            this._filters[TKAdminFilters.ADMIN1] = this._currentAdmin1.pcode;
          }

          if (this._currentCamp.admin2 !== this._currentAdmin2) {
            this._currentAdmin2 = this._currentCamp.admin2;
            this._filters[TKAdminFilters.ADMIN2] = this._currentAdmin2.pcode;
          }

          this._currentSubmission = this._currentCamp.submissions[0];

          this._lastModification = `camp=${this._currentCamp.id}`;
        }
        this.updateFiltering();
      }
    } else {
      // Clear camp
      this._levelToZoom = this._currentAdmin2
        ? TKAdminFilters.ADMIN2
        : this._currentAdmin1
        ? TKAdminFilters.ADMIN1
        : TKAdminFilters.SURVEY;
      this._currentCamp = null;
      this._currentSubmission = null;
      this._filters[TKAdminFilters.CAMP] = null;
      this._lastModification = "clearCamp";
      this.updateFiltering();
    }
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Update filtering
  // ////////////////////////////////////////////////////////////////////////////

  // Admin1
  filterAdmin1BaseOnFilteredCamp(): void {
    // Filter Admin1 based on filtered Camp List //////////////////////////////
    const validAdmin1 = new Set(
      this._filteredCampsList.map(camp => camp.admin1.pcode)
    );
    this._filteredAdmin1List = this._filteredAdmin1List.filter(item =>
      validAdmin1.has(item.pcode)
    );

    if (this._currentAdmin1 && !validAdmin1.has(this._currentAdmin1.pcode)) {
      this._currentAdmin1 = null;
      this._filters[TKAdminFilters.ADMIN1] = null;
    }
  }

  // Admin2
  filterAdmin2BaseOnFilteredCamp(): void {
    // Filter Admin2 based on filtered Camp List //////////////////////////////
    const validAdmin2 = new Set(
      this._filteredCampsList.map(camp => camp.admin2.pcode)
    );
    this._filteredAdmin2List = this._filteredAdmin2List.filter(item =>
      validAdmin2.has(item.pcode)
    );
    if (this._currentAdmin2 && !validAdmin2.has(this._currentAdmin2.pcode)) {
      this._currentAdmin2 = null;
      this._filters[TKAdminFilters.ADMIN2] = null;
    }
  }

  // Sponateneous
  updateFiltering() {
    if (this._currentSurvey) {
      // Reset camp list ////////////////////////////////////////////////////////
      this._filteredCampsList = this._currentSurvey.camps;
      this._filteredAdmin1List = this._currentSurvey.boundaries.admin1;
      this._filteredAdmin2List = this._currentSurvey.boundaries.admin2;

      // Camp filtering base on Admin1 //////////////////////////////////////////
      if (this._filters[TKAdminFilters.ADMIN1]) {
        this._filteredCampsList = this._filteredCampsList.filter(
          camp => camp.admin1.pcode === this._filters[TKAdminFilters.ADMIN1]
        );
        this.filterAdmin2BaseOnFilteredCamp();
      }

      // Camp filtering base on Admin2 //////////////////////////////////////////
      if (this._filters[TKAdminFilters.ADMIN2]) {
        this._filteredCampsList = this._filteredCampsList.filter(
          camp => camp.admin2.pcode === this._filters[TKAdminFilters.ADMIN2]
        );
      }

      // Update filtered typed camps list
      this._filteredTypedCampsList = this._filteredCampsList.filter(item => {
        if (item.type && this._typeSite[item.type.formattedName]) {
          return this._typeSite[item.type.formattedName].active;
        }
        return false;
      });
    }
  }
}
