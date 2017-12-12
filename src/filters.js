import moment from 'moment'
import accounting from 'accounting'

export default {
	currency (val) {
    	return accounting.formatMoney(val)
	},
	phone (phone, isEmpty) {
		phone = String(phone);
		isEmpty = isEmpty || ''
		if (!phone) {
			return isEmpty
		}
		if (phone.length >= 11) {
			phone = phone.substring(1);
		}
		return phone.replace(/[^0-9]/g, '')
                	.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

	},
	uppercase (str) {
		return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
	},
	normalcase (str) {
		if (!str) {
			return ''
		}
		var s = str.toLowerCase()
		return s.charAt(0).toUpperCase() + s.slice(1)
	},
	fromnow (time, format) {
		if (time) {
			return moment(time, format).fromNow()
		} else {
			return '';
		}
	},
	dateFormat (time, format) {
		format = format || 'MMM YYYY'
		if (time) {
			return moment(time).format(format)
		} else {
			return '';
		}
	}
}
