const USER_PASSWORD = '1111'
const EMAIL_PROVIDER = 'email'
const LIMIT_GET_ONCE = 100
const TEN_DAYS = 86400000
const SEVEN_DAYS = 604800000
const ONE_MONTH = 2592000000
const ONE_HOUR = 3600000
const AVATAR_DEFAULT = 'https://s3-ap-southeast-1.amazonaws.com/shynh-house/assets/user-default.png'

const BOOKING_NOTIFICATION = ['Bạn có cuộc hẹn với ', ' vào lúc ']
const BOOKING_NOTIFICATION_KH = ['Bạn có cuộc hẹn tại ', ' làm ', ' vào lúc ']
const CANCEL_BOOKING_NOTIFICATION = ['Cuộc hẹn của bạn với ', ' vào lúc ', ' đã bị hủy.']
const DAY_OFF_NOTIFICATION = ['Ngày nghỉ của bạn vào ngày ', ' đã được đồng ý.', ' không được đồng ý.']
const RATING_NOTIFICATION = ['Bạn vừa hoàn thành dịch vụ ', '. Hãy giúp chúng tôi đánh giá chất lượng dịch vụ.']

const SHYNH_START_BOOKING_HOUR = 9
const SHYNH_END_BOOKING_HOUR = 19

var userRoles = {
  OWNER: 'owner',
  SUPERVISOR: 'supervisor',
  MANAGER: 'manager',
  EMPLOYEE: 'nv',
  USER: 'kh'
}

var userTypes = {
  GOLD: 'gold',
  SILVER: 'silver',
  NORMAL: 'normal'
}

var employeeSkills = {
  FACIAL_NAN_MUN: 'Facial - Nặn mụn',
  FACIAL_CHUYEN_SAU: 'Facial - Chuyên sâu',
  FACIAL_DIEU_TRI: 'Facial - Điều trị',
  BODY: 'Body',
  NAIL: 'Nail',
  HAIR: 'Hair'
}

var salaryType = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

var billStatus = {
  NOT_PAIR: 'not_pair',
  PAIRING: 'pairing',
  COMPLETED: 'completed'
}

var branch = {
  SHYNH_HOUSE_1: 'Shynh House 1',
  SHYNH_HOUSE_2: 'Shynh House 2',
  SHYNH_HOUSE_CLINIC: 'Shynh House Clinic',
  SHYNH_HOUSE_THU_DUC: 'Shynh House Thủ Đức',
  SHYNH_HOUSE_CENTER: 'Shynh House Center'
}

var mapBranchNameToVarName = {
  'Shynh House 1': 'shynh_house_1',
  'Shynh House 2': 'shynh_house_2',
  'Shynh House Clinic': 'shynh_house_clinic',
  'Shynh House Thủ Đức': 'shynh_house_thu_duc',
  'Shynh House Center': 'shynh_house_center'
}

var newsType = {
  NEWS: 'Tin tức',
  PROMOTION: 'Khuyến mãi'
}

var newsNguoiXem = {
  EMPLOYEE: userRoles.EMPLOYEE,
  USER: userRoles.USER,
  ALL: 'all'
}

var bookingStatus = {
  INCOMING: 'incoming',
  CANCELED: 'canceled',
  PASSED: 'passed'
}

var serviceType = {
  FACIAL_NAN_MUN: 'Facial - Nặn mụn',
  FACIAL_CHUYEN_SAU: 'Facial - Chuyên sâu',
  FACIAL_DIEU_TRI: 'Facial - Điều trị',
  BODY: 'Body',
  NAIL: 'Nail',
  HAIR: 'Hair'
}

var serviceUnit = {
  CAI: 'Cái',
  SUAT: 'Suất'
}

var employeeClass = {
  LESS_THAN_3_MONTHS: '1 - 3 tháng',
  LESS_THAN_9_MONTHS: '3 - 9 tháng',
  LESS_THAN_12_MONTHS: '9 - 12 tháng',
  LESS_THAN_2_YEARS: '< 2 năm',
  GREATER_THAN_2_YEARS: '> 2 năm',
  LE_TAN: 'Lễ tân'
}

var mapEmployeeClassToVarName = {
  '1 - 3 tháng': 'LESS_THAN_3_MONTHS',
  '3 - 9 tháng': 'LESS_THAN_9_MONTHS',
  '9 - 12 tháng': 'LESS_THAN_12_MONTHS',
  '< 2 năm': 'LESS_THAN_2_YEARS',
  '> 2 năm': 'GREATER_THAN_2_YEARS',
  'Lễ tân': 'LE_TAN'
}

var dayOffStatus = {
  APPROVED: 'approved',
  DENIED: 'denied',
  PENDING: 'pending'
}

var chuyenCanStatus = {
  CHUYEN_CAN: 'true',
  KHONG_CHUYEN_CAN: 'false',
  PENDING: 'pending'
}

var notificationType = {
  BOOKING: 'booking',
  DAYOFF: 'dayoff',
  SALARY: 'salary',
  RATING: 'rating'
}

const uploadTypes = {
  USER_AVATAR: 'user_avatar'
}

var hinhThuc = {
  TIEN_MAT: 'tienmat',
  TIEN_SPA: 'tienspa'
}

var userRolesArray = Object.keys(userRoles).map(function (k) {
  return userRoles[k]
})

var employeeSkillsArray = Object.keys(employeeSkills).map(function (k) {
  return employeeSkills[k]
})

var salaryTypeArray = Object.keys(salaryType).map(function (k) {
  return salaryType[k]
})

var billStatusArray = Object.keys(billStatus).map(function (k) {
  return billStatus[k]
})

var branchArray = Object.keys(branch).map(function (k) {
  return branch[k]
})

var newsTypeArray = Object.keys(newsType).map(function (k) {
  return newsType[k]
})

var bookingStatusArray = Object.keys(bookingStatus).map(function (k) {
  return bookingStatus[k]
})

var serviceTypeArray = Object.keys(serviceType).map(function (k) {
  return serviceType[k]
})

var serviceUnitArray = Object.keys(serviceUnit).map(function (k) {
  return serviceUnit[k]
})

var employeeClassArray = Object.keys(employeeClass).map(function (k) {
  return employeeClass[k]
})

var userTypesArray = Object.keys(userTypes).map(function (k) {
  return userTypes[k]
})

var dayOffStatusArray = Object.keys(dayOffStatus).map(function (k) {
  return dayOffStatus[k]
})

var notificationTypeArray = Object.keys(notificationType).map(function (k) {
  return notificationType[k]
})

var newsNguoiXemArray = Object.keys(newsNguoiXem).map(function (k) {
  return newsNguoiXem[k]
})

var chuyenCanStatusArray = Object.keys(chuyenCanStatus).map(function (k) {
  return chuyenCanStatus[k]
})

var hinhThucArray = Object.keys(hinhThuc).map(function (k) {
  return hinhThuc[k]
})

module.exports = {
  userRoles: userRoles,
  userRolesArray: userRolesArray,
  employeeSkills: employeeSkills,
  employeeSkillsArray: employeeSkillsArray,
  salaryType: salaryType,
  salaryTypeArray: salaryTypeArray,
  billStatus: billStatus,
  billStatusArray: billStatusArray,
  LIMIT_GET_ONCE: LIMIT_GET_ONCE,
  USER_PASSWORD: USER_PASSWORD,
  EMAIL_PROVIDER: EMAIL_PROVIDER,
  branch: branch,
  branchArray: branchArray,
  newsType: newsType,
  newsTypeArray: newsTypeArray,
  bookingStatus: bookingStatus,
  bookingStatusArray: bookingStatusArray,
  userTypes: userTypes,
  userTypesArray: userTypesArray,
  serviceType: serviceType,
  serviceTypeArray: serviceTypeArray,
  serviceUnit: serviceUnit,
  serviceUnitArray: serviceUnitArray,
  employeeClass: employeeClass,
  employeeClassArray: employeeClassArray,
  mapEmployeeClassToVarName: mapEmployeeClassToVarName,
  TEN_DAYS: TEN_DAYS,
  ONE_DAY: 1000 * 60 * 60 * 24,
  ONE_HOUR: ONE_HOUR,
  BOOKING_NOTIFICATION: BOOKING_NOTIFICATION,
  mapBranchNameToVarName: mapBranchNameToVarName,
  dayOffStatusArray: dayOffStatusArray,
  dayOffStatus: dayOffStatus,
  uploadTypes: uploadTypes,
  DAY_OFF_NOTIFICATION: DAY_OFF_NOTIFICATION,
  notificationType: notificationType,
  notificationTypeArray: notificationTypeArray,
  RATING_NOTIFICATION: RATING_NOTIFICATION,
  CANCEL_BOOKING_NOTIFICATION: CANCEL_BOOKING_NOTIFICATION,
  newsNguoiXem: newsNguoiXem,
  newsNguoiXemArray: newsNguoiXemArray,
  AVATAR_DEFAULT: AVATAR_DEFAULT,
  SEVEN_DAYS: SEVEN_DAYS,
  ONE_MONTH: ONE_MONTH,
  chuyenCanStatus: chuyenCanStatus,
  chuyenCanStatusArray: chuyenCanStatusArray,
  BOOKING_NOTIFICATION_KH: BOOKING_NOTIFICATION_KH,
  hinhThuc: hinhThuc,
  hinhThucArray: hinhThucArray,
  SHYNH_START_BOOKING_HOUR: SHYNH_START_BOOKING_HOUR,
  SHYNH_END_BOOKING_HOUR: SHYNH_END_BOOKING_HOUR
}
