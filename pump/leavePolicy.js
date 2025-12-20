

// org has this data
leavePolicy = {
  tag: 'leavePolicy',
  brief: 'กำหนดเกี่ยวกับการลา ต่างๆ ขององค์กร',
  country: 'Thailand',
  organization:'Navapracha 2025 Co., Ltd.',
  effective: '2025-12-01',
  active: true,
  leaveType: {
    sick: { 
      daysAllowedPerYear: 30, 
      daysToPayFull: 30, 
      brief:'ลาป่วยได้รับค่าจ้าง ได้ 30 วันต่อปี ต้องมีใบรับรองแพทย์', 
      thaiName:'ลาป่วย',
    },
    personal: { 
      daysAllowedPerYear: 3, 
      daysToPayFull: 3, 
      brief:'ลากิจได้รับค่าจ้าง ได้ 3 วันต่อปี', 
      thaiName:'ลากิจ' 
      },
    annual: { 
      daysAllowedPerYear: 6, 
      daysToPayFull: 6, 
      appliedForMinimumWorkYear: 1, 
      canTransferToNextYear: true,
      brief:'ลาพักร้อนได้ไม่น้อยกว่า 6 วันต่อปี ได้ค่าจ้าง แต่ต้องทำงานต่อเนื่อง 1 ปีขึ้นไป ใช้ไม่หมดสามารถทบไปปีถัดไปได้',
      thaiName:'ลาพักร้อน'
    },
    withoutPay: {
      daysAllowedPerYear: 5,
      appliedForMinimumWorkYear: 1,
      canTransferToNextYear: false,
      brief:'ลาโดยไม่รับค่าจ้าง ให้ลาได้เต็มที่ 5 วัน/ปี แต่ต้องทำงานแล้ว 1 ปีขึ้นไป ไม่มีทบ',
      thaiName:'ลาโดยไม่รับค่าจ้าง'
    },
    maternity: {
      daysAllowed: 98, 
      daysToPayFull: 45, 
      daysSocialSecurityPayFull: 45, 
      brief:'แม่ลาคลอดได้ 98 วัน ได้รับค่าจ้างเต็ม 45 วัน อีก 45 วัน ให้เบิกจากประกันสังคม',
      thaiName:'ลาคลอด'
    },
    sterilization: {
      daysAllowed: 'as doctor suggested',
      daysToPayFull: 'as doctor suggested',
      brief:'ลาทำหมัน จำนวนวันได้ตามที่แพทย์กำหนด ต้องจ่ายค่าจ้างเต็ม ทั้งหมด',
      thaiName:'ลาทำหมัน'
    },
    training: {
      daysAllowed: 0,
      daysToPayFull: 0,
      appliedForMinimumWorkYear: 1,
      brief:'ลาเพื่อฝึกอบรม ลาได้ แต่ไม่ได้ค่าจ้าง',
      thaiName:'ลาเพื่อฝึกอบรม'
    },
    ordination: {
      daysAllowed: 0,
      brief:'ลาบวช',
      thaiName:'ลาบวช'
    },
    menstrual: {
      daysAllowed: 0,
      brief:'ลาปวดประจำเดือนของสตรี',
      thaiName:'ลาปวดประจำเดือน'
    }
  },
  _time: [ Date.now() ],
  enterBy: '@sern'
}



// each staff has this count
leaveCount = {
  sick: [ 0, 30 ],
  personal: [ 0, 3],
  annual: [ 0, 0],
  withoutPay: [0,0],
  maternity: [ 0, 98],
  sterilization: [ 0, 'as docor suggested'],
  training: [0,0],
  ordination: [0,0],
  menstrual: [0,0]
}


pumpb.leave = {
  staffNickName: 0,
  leaveType: 0,
  fromDate: 0,
  toDate: 0,
  fromTime: 0,
  toTime: 0,
  totalHours: 0,
  
}
