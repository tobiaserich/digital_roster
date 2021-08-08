import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import * as worker from "pdfjs-dist/build/pdf.worker.entry";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/display/api";
pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

interface clusterItem {
  name: string;
  i: number;
}

interface EmployeesItem {
  employees: (TextItem | CustomTextMarkedContent)[];
  name: string;
  i: number;
}

export interface SinglePersonRoster {
  dp: string[];
  name: string | null;
  status?: string;
  volume?: string;
}

interface CustomTextMarkedContent extends TextMarkedContent {
  height: number;
  str: string;
  transform: never;
}

const getRoster = (): Promise<
  { cluster: string; employees: SinglePersonRoster[] }[]
> => {
  // Initial loading of PDF file and combining the sites to one array
  const initializePDF = async (
    month: string
  ): Promise<(TextItem | CustomTextMarkedContent)[]> => {
    const pdf = await pdfjsLib.getDocument(`${month}.pdf`).promise;
    const totalPages = await pdf.numPages;
    let pages: (TextItem | CustomTextMarkedContent)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent({
        normalizeWhitespace: false,
        disableCombineTextItems: false,
        includeMarkedContent: false,
      });
      const items: any = content.items;
      pages = [...pages, ...items];
    }
    return pages;
  };

  // Remove Placeholder Spaces
  const killFlatWhitespaces = (
    content: (TextItem | CustomTextMarkedContent)[]
  ) => {
    const withoutWhitespaces = content?.filter((entry) => entry.height > 0);
    return withoutWhitespaces;
  };

  //Extract the different clusters and the position in the array
  const getClusters = async (data: (TextItem | CustomTextMarkedContent)[]) => {
    const clusters: clusterItem[] = [];

    data.forEach((entry: TextItem | CustomTextMarkedContent, index: number) => {
      const nextEntry: TextItem | CustomTextMarkedContent = data[index + 1];
      const lastEntry: TextItem | CustomTextMarkedContent = data[index - 1];
      if (nextEntry?.str === "spxpCRMAILER") {
        clusters.push({ name: entry.str, i: index });
      }
      if (
        lastEntry?.str === " " &&
        nextEntry.str === "01  " &&
        entry.str.trim()
      ) {
        clusters.push({ name: entry.str, i: index });
      }
    });
    return clusters;
  };

  // separate the employee data block to the different clusters
  const employeesToClusterSorting = (
    clusters: clusterItem[],
    data: (TextItem | CustomTextMarkedContent)[]
  ): any => {
    const employees = clusters.map((entry, index) => {
      const lastIndex = clusters[index - 1]?.i;
      const totalEmployees = data.slice(lastIndex, entry.i);
      return { ...entry, employees: totalEmployees };
    });

    employees.forEach((entry, index) => {
      const totalEmployees = entry.employees;
      const findDate =
        totalEmployees.filter((entry) => entry.str === "01  ").length > 1 &&
        totalEmployees.findIndex(
          (entry, index) => entry.str === "01  " && index > 13
        );

      const overshootEmployees = findDate
        ? totalEmployees.splice(0, findDate)
        : undefined;

      if (overshootEmployees !== undefined) {
        const newArray =
          employees[index - 1].employees.concat(overshootEmployees);
        employees[index - 1].employees = newArray;
      }
    });
    return employees;
  };

  //separate every employee and add him to his cluster
  const separateEmployees = (employees: EmployeesItem[]) => {
    const allEmployees = employees.map((entry) => {
      const totalEmployees = entry.employees;
      const employeePlus: SinglePersonRoster[] = [];
      let stop: boolean | null = null;

      let fillAgainAt: any = {};
      totalEmployees?.forEach((entry, index) => {
        const firstValidation = /(\w.+)+, (\w.+)+/g;
        const secondValidation = /(\w.+), (\w.+),[^0-9]/g;
        const clearedString = entry?.str?.trim();
        const nextEntry = totalEmployees[index + 1];
        const nextString = nextEntry?.str?.trim();
        const fullName = `${clearedString} ${nextString}`;
        const currentEmployeeIndex = employeePlus.length - 1;
        const employeeDP = employeePlus[currentEmployeeIndex]?.dp;
        const employmentInfo = employeeDP?.[0]?.split("-");
        const employeeStatus = employmentInfo?.[0].includes(",")
          ? employmentInfo?.[0].replace(/(\w+),/g, "").trim()
          : employmentInfo?.[0].trim();

        const employmentVolume = employmentInfo
          ? !isNaN(parseInt(employmentInfo?.[employmentInfo.length - 1]))
            ? employmentInfo?.[employmentInfo.length - 1]
            : employeeDP?.[1]
          : "";

        if (
          clearedString?.match(firstValidation) &&
          clearedString.endsWith(",")
        ) {
          employeePlus.push({ name: clearedString, dp: [] });
          stop = false;
        } else if (fullName.match(secondValidation)) {
          const matching = fullName.match(secondValidation);
          stop = false;
          employeePlus.push({
            name: matching && matching?.[0].trim(),
            dp: [],
          });
        } else if (employeePlus.length > 0 && !stop) {
          if (nextString === "spxp") {
            stop = true;
          } else {
            if (
              fillAgainAt &&
              employeePlus[currentEmployeeIndex]?.dp?.length - 1 ===
                fillAgainAt.pos
            ) {
              for (let i = 0; i < fillAgainAt.turns; i++) {
                employeePlus[currentEmployeeIndex]?.dp?.push(" ");
              }

              fillAgainAt = null;
            }
            employeePlus[currentEmployeeIndex]?.dp?.push(entry.str);
            employeePlus[currentEmployeeIndex].status = employeeStatus;
            employeePlus[currentEmployeeIndex].volume = employmentVolume;
            const summe = nextEntry?.transform[4] - entry.transform[4];
            if (summe > 30 && summe < 100) {
              const turns = Math.floor(summe / 28);
              for (let i = 0; i < turns; i++) {
                employeePlus[currentEmployeeIndex]?.dp?.push(" ");
              }
            }
            if (summe > 110) {
              const turns = Math.floor(
                summe < 200 ? (summe - 100) / 28 : summe / 28
              );
              fillAgainAt = {
                pos:
                  employeePlus[currentEmployeeIndex]?.dp?.length -
                  1 +
                  (employeePlus[currentEmployeeIndex - 1]?.dp?.length - 1) / 2,
                turns: turns,
              };
              for (let i = 0; i < turns; i++) {
                employeePlus[currentEmployeeIndex]?.dp?.push(" ");
              }
            }
          }
        }
      });
      employeePlus.forEach((entry) => {
        entry.dp.length % 2 === 0 ? entry.dp.shift() : "";
        entry.dp.shift();
      });

      return { cluster: entry.name, employees: employeePlus };
    });
    return allEmployees;
  };

  const sortData = async () => {
    const result = await initializePDF("Jan_21");
    const cleanData = await killFlatWhitespaces(result);
    const clusters = await getClusters(cleanData);
    const sortEmployeesToCluster = await employeesToClusterSorting(
      clusters,
      cleanData
    );

    const separateEmployeesinClusters = await separateEmployees(
      sortEmployeesToCluster
    );
    return separateEmployeesinClusters;
  };

  return sortData();
};

export default getRoster;
