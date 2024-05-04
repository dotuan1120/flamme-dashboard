/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
// import { newPlayer } from "./makeData";
import { Player, TableConfig } from "../types";
import { round } from 'lodash';
import React from "react";
import tableConfig from "../mock/tableConfig.json";
import { ColumnType } from "../common/constants";
import { beautifyWord } from "./beautify";

export const generateColumns = (): ColumnDef<Player>[] => {
  const configs:TableConfig[] = tableConfig;

  type IndexedPlayer = Player & { [key: string]: any };

  return configs.map((setting) => ({
    id: setting.columnName,
    columns: [
      {
        accessorFn: (row: IndexedPlayer) => row[setting.columnName],
        id: beautifyWord(setting.columnName),
        cell: (info) => parseValue(setting, info.getValue()),
        header: () => React.createElement('span', null, beautifyWord(setting.columnName)),
        meta: {
          filterVariant: setting.filterType
        }
      },
    ],
  }));
};


const parseValue = (setting: TableConfig, value: any): string => {
  switch (setting.columnType) {
    case ColumnType.Number:
      return round(value, 2).toString();
    case ColumnType.Percentage:
      return `${round(value * 100, 2)}%`;
    default:
      return value.toString();
  }
}
