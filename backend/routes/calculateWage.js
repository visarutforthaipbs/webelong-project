const express = require("express");
const router = express.Router();
const { minimumWages, wageMultipliers } = require("../services/dataLoader");
const mongoose = require("mongoose");

const calculatorInputSchema = new mongoose.Schema({
  province: String,
  dailyWage: Number,
  daysWorked: Number,
  hoursWorked: Number,
  overtimeHours: Number,
  holidayWork: Boolean,
  result: Object,
  createdAt: { type: Date, default: Date.now },
});
const CalculatorInput = mongoose.model(
  "CalculatorInput",
  calculatorInputSchema
);

// Helper: Find province entry by code
function findProvinceEntry(provinceCode) {
  if (!provinceCode) return null;
  const [provinceBase, noteCode] = provinceCode.split("--");
  return minimumWages.find(
    (p) =>
      p.province === provinceBase &&
      ((p.note && p.note.replace(/\s/g, "").toLowerCase()) ===
        (noteCode || "").replace(/\s/g, "").toLowerCase() ||
        (!p.note && !noteCode))
  );
}

router.post("/", async (req, res) => {
  try {
    // 1. Parse and validate inputs
    const provinceCode = req.body.provinceCode || "";
    const userDailyWage = parseFloat(req.body.userDailyWage) || 0;
    const daysWorked = parseFloat(req.body.daysWorked) || 0;
    const overtimeHoursPerDay = parseFloat(req.body.overtimeHoursPerDay) || 0;
    const holidayHoursPerMonth = parseFloat(req.body.holidayHoursPerMonth) || 0;

    // 2. Province lookup
    const provinceEntry = findProvinceEntry(provinceCode);
    if (!provinceEntry) {
      return res.status(400).json({ error: "Invalid province code" });
    }
    const minDailyWage = provinceEntry.min_daily_wage || 0;

    // 3. Base wage calculation
    const legalWeekly = minDailyWage * daysWorked;
    const legalMonthly = legalWeekly * 4.33;
    const actualWeekly = userDailyWage * daysWorked;
    const actualMonthly = actualWeekly * 4.33;

    // 4. Overtime pay
    const hourlyRate = userDailyWage / 8;
    const overtimePay =
      hourlyRate *
      overtimeHoursPerDay *
      daysWorked *
      wageMultipliers.overtime_weekday_multiplier *
      4.33;

    // 5. Holiday pay
    const holidayPay =
      hourlyRate *
      holidayHoursPerMonth *
      wageMultipliers.holiday_work_multiplier;

    // 6. Total & status
    const totalActual = actualMonthly + overtimePay + holidayPay;
    const difference = totalActual - legalMonthly;
    const status = difference >= 0 ? "meets" : "underpaid";

    // 7. Response
    res.json({
      legalMonthly: Math.round(legalMonthly),
      actualMonthly: Math.round(actualMonthly),
      overtimePay: Math.round(overtimePay),
      holidayPay: Math.round(holidayPay),
      totalActual: Math.round(totalActual),
      difference: Math.round(difference),
      status,
    });

    // Store input and result in MongoDB
    await CalculatorInput.create({
      province: req.body.province,
      dailyWage: userDailyWage,
      daysWorked,
      hoursWorked: overtimeHoursPerDay,
      overtimeHours: overtimeHoursPerDay,
      holidayWork: !!holidayHoursPerMonth,
      result: {
        legalWage: Math.round(legalMonthly),
        actualWage: Math.round(totalActual),
        underpaid: totalActual < legalMonthly,
        recommendation:
          totalActual < legalMonthly
            ? "คุณอาจได้รับค่าจ้างต่ำกว่ากฎหมาย กรุณาแจ้งปัญหา"
            : "คุณได้รับค่าจ้างตามกฎหมายแล้ว",
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Calculation error", details: err.message });
  }
});

module.exports = router;
