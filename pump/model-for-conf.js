// this file to set model for pump.conf


leavePolicy = {
  tag: 'leavePolicy',
  organization: 'navapracha-2025',
  orgCode: 'navap',
  country: 'Thailand',
  active: true,
  startDate: '2025-12-01',
  endDate: 'upto-policy',
  leave: [
    {
      nameTh    : 'ลาป่วย',
      nameEn    : 'Sick Leave',
      nameCode  : 'sickLeave',
      for       : 'all staff',
      allowedDaysPerYear: 30,
      payRate   : 1,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy'
    },
    {
      nameTh    : 'ลากิจ',
      nameEn    : 'Personal Leave',
      nameCode  : 'personalLeave',
      for       : 'all staff',
      allowedDaysPerYear: 3,
      payRate   : 1,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy'
    },
    {
      nameTh    : 'ลาพักร้อน',
      nameEn    : 'Annual Leave',
      nameCode  : 'annualLeave',
      for       : 'staff who already worked full year, 12 months',
      allowedDaysPerYear: 6,
      payRate   : 1,
      transferRemainingToNextYear: true,
      canConvertToCurrentWages: true,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy'
    },
    {
      nameTh    : 'ลาทำหมัน',
      nameEn    : 'Sterilization Leave',
      nameCode  : 'sterilizationLeave',
      for       : 'all staff',
      allowedDaysPerYear: 'as doctor described',
      payRate   : 1,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy'
    },
    {
      nameTh    : 'ลาฝึกอบรม',
      nameEn    : 'Training Leave',
      nameCode  : 'trainingLeave',
      for       : '1 year up',
      allowedDaysPerYear: 0,
      payRate   : 0,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy'
    },
    {
      nameTh    : 'ลาบวช',
      nameEn    : 'Ordination Leave',
      nameCode  : 'ordinationLeave',
      for       : 'all staff',
      allowedDaysPerYear: 0,
      payRate   : 0,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy'
    },
    {
      nameTh    : 'ลาโดยไม่รับค่าจ้าง',
      nameEn    : 'Leave Without Pay',
      nameCode  : 'leaveWithoutPay',
      for       : 'all staff',
      allowedDaysPerYear: 0,
      payRate   : 0,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy'
    },
    {
      nameTh    : 'ลาคลอด',
      nameEn    : 'Maternity Leave',
      nameCode  : 'maternityLeave',
      for       : 'all female staff',
      allowedDaysPerYear: 98,
      payRate   : 1,
      daysToPay : 45,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy',
      note      : 'another 45 days staff can claim Social Security Fund'
    },
    {
      nameTh    : 'ลาไปช่วยภรรยาที่คลอดบุตร',
      nameEn    : 'Paternity Leave',
      nameCode  : 'paternityLeave',
      for       : 'all staff who is father',
      allowedDaysPerYear: 15,
      payRate   : 1,
      daysToPay : 15,
      active    : true,
      status    : 'active',
      startDate : '2025-12-01',
      endDate   : 'upto-policy',
      note      : 'just effective on 2025-12-07',
      rule      : 'must request by first 90 days of the child birthday'
    },

  ]
}
 



taxPolicy = {
  tag: 'taxPolicy',
  country: 'Thailand',
  organization: 'navapracha-2025',
  orgCode: 'navap',
  active: true,
  startDate: '2025-12-01',
  endDate: 'upto-policy',
  tax: [
    {
      nameTh: 'ภาษีมูลค่าเพิ่ม',
      nameEn: 'VAT',
      rate: 0.07,
      calculattionMethod: 'ontop',
      minimumPrice: null,
      active: true,
      startDate: 'as the gov policy',
      endDate: 'as the gov policy'
    },
    {
      nameTh: 'ภาษีหัก ณ ที่จ่าย',
      nameEn: 'WHT',
      rate: 0.03,
      calculattionMethod: 'deduct',
      minimumPrice: 1000,
      active: true,
      startDate: 'as the gov policy',
      endDate: 'as the gov policy'
    },
  ]
}







amazon shift
05:30 - 14:00
10:30 - 18:30


benefitPolicy = {
  tag:'benefitPolicy',
  organization:'navapracha-2025',
  orgCode:'navap',
  active: true,
  startDate: '2025-12-01',
  endDate:'upto-policy',
  benefit:[
    {
      nameTh:'เบี้ยขยัน',
      nameEn:'ontime incentive',
      brief:'มาทำงานก่อนเวลาตามกำหนด ได้เบี้ยขยัน ถือว่าขยัน และรับผิดชอบงานดี ได้เงินเพิ่มในเดือนนั้น',
      for:'each staff',
      appliedDepartments:['fuel services','amazon cafe'],
      checkPoint:'15 min before shift starts',
      active: true,
      benefitType: 'cash',
      value: 1000,
      per: 'month'
    },
    {
      nameTh:'ค่าผ่าน audit',
      nameEn:'audit incentive',
      brief:'กะไหนที่ผ่านการ audit จะได้เงินเพิ่ม ในเดือนที่ทราบผลจาก ปตท.',
      for: 'each team member',
      appliedDepartments: ['fuel services','amazon cafe'],
      checkPoint: 'report from PTT',
      active: true,
      benefitType: 'cash',
      value: 500,
      per: 'month'
    },
    {
      nameTh:'ค่าแต่งหน้า',
      nameEn:'makeup support',
      brief:'ให้ค่าแต่งหน้า ไม่งั้นไม่ยอมแต่งกัน ลูกค้าก็หนีหมด',
      for:'each staff',
      appliedDepartments:['amazon cafe'],
      checkPoint: 'manager checks',
      benefitType:'cash',
      value: 1000,
      per:'month'
    }
  ]
}




fundPolicy = {
  tag:'fundPolicy',
  organization: 'navapracha-2025',
  orgCode: 'navap',
  active: true,
  startDate: '2025-12-01',
  endDate: 'upto-policy',
  fund:[
    {
      nameTh:'กองทุนประกันสังคม',
      nameEn:'social security fund',
      brief:'กฎหมายบังคับเพื่อสิทธิ์ประโยชน์ของแรงงาน',
      deductRate: 0.05,
      from: {
        monthlyStaff: 'monthlyRate',
        dailyStaff: 'totalWagesInThatMonth'
      },
      at: 'everyWagesPay',
       
    }
  ]
}




// when staff takes leave the data goes to 
// pump.leave
// pump.staff

leaveCount = {
  sickLeave: { got: 30, used: 0},
  personalLeave: { got: 3, used: 0},
  annualLeave: { got: 0, used: 0},
  sterilizationLeave: { got: 'as doctor said', used: 0},
  trainingLeave: { got: 0, used: 0},
  ordinationLeave: { got:0, used: 0},
  maternityLeave: { got: 98, used: 0},
  paternityLeave: { got: 15, used: 0}

}