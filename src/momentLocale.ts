import 'moment/locale/ru'
import { updateLocale } from 'moment'

const monthsShort = 'Янв._Февр._Мар._Апр._Мая_Июня_Июля_Авг._Сент._Окт._Нояб._Дек.'.split('_')
const weekdaysMin = 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_')
updateLocale('ru', { monthsShort, weekdaysMin })