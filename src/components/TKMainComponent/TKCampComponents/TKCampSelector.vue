<template lang="html">
  <transition mode="out-in" name="fade">
    <div :key="$root.$i18n.locale" class="tk-camp-selector">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('survey')"
            v-model="dataset.currentSurvey"
            :items="dataset.surveys"
            item-text="name"
            :disabled="dataset.surveys.length < 2"
            return-object
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span>{{ $t("selectText") }} {{ $t("survey").toLowerCase() }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('infosAdmin1')"
            v-model="dataset.currentAdmin1"
            :items="dataset.filteredAdmin1List"
            :disabled="!dataset.filteredAdmin1List.length"
            item-text="name"
            return-object
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span
          >{{ $t("selectText") }} {{ $t("infosAdmin1").toLowerCase() }}</span
        >
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('infosAdmin2')"
            v-model="dataset.currentAdmin2"
            :items="dataset.filteredAdmin2List"
            :disabled="!dataset.filteredAdmin2List.length"
            item-text="name"
            return-object
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span
          >{{ $t("selectText") }} {{ $t("infosAdmin2").toLowerCase() }}</span
        >
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-autocomplete
            class="tk-autocomplete"
            flat
            dense
            :label="$t('camp')"
            v-model="dataset.currentCamp"
            :items="dataset.filteredCampsList"
            :disabled="!dataset.filteredCampsList.length"
            item-text="infos.name"
            return-object
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-autocomplete>
        </template>
        <span>{{ $t("selectText") }} {{ $t("camp").toLowerCase() }}</span>
      </v-tooltip>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TKDatasetFilterer } from "@/domain/survey/TKDatasetFilterer";

@Component
export default class TKCampSelector extends Vue {
  @Prop()
  readonly dataset!: TKDatasetFilterer;
}
</script>
<style scoped>
.tk-camp-selector {
  border-radius: 8px;
  align-items: center;
  background-color: #f0fbffcc;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  box-shadow: 0 0 20px 2px rgba(58, 158, 211, 0.15);
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 12px;
  display: flex;
  flex-flow: row wrap;
  row-gap: 24px;
  justify-content: space-evenly;
}

.tk-autocomplete {
  width: 20%;
  margin: 0 15px;
  height: 30px;
  min-width: 200px;
}
</style>
