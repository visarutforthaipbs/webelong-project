interface StudentData {
  "รหัสจังหวัด": number;
  "จังหวัด": string;
  "จำนวน (ชาย)": string;
  "จำนวน (หญิง)": string;
  "ยอดรวม": string;
}

export const calculateStudentPopulation = (studentData: StudentData[], provinceId: number): number => {
  const provinceData = studentData.find(item => item["รหัสจังหวัด"] === provinceId);
  
  if (!provinceData) {
    return 0;
  }
  
  // Remove commas and convert to number
  const total = provinceData["ยอดรวม"].replace(/,/g, '');
  return parseInt(total, 10) || 0;
};

export const loadStudentData = async (): Promise<StudentData[]> => {
  try {
    const response = await fetch('/data/student-pop-67.json');
    const data: StudentData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading student population data:', error);
    return [];
  }
};