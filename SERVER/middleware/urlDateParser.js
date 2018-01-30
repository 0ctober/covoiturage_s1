var moment = require('moment')
moment().format()
moment.locale("fr")

class urlDateParser {

	static urlToData (data){

		console.log("----- urlToData -----")
		let date
		console.log("data.includes('&')")
		console.log(data.includes('&'))
		if(data.includes('&')){
			let tmp = data.split('&')
			console.log (data)
			date = tmp[0] + "T" + tmp[1] + "Z"
			console.log("TEST## " + date)
		}
		console.log("----- urlToData -----")
		return new Date(date)
	}

	static dataToUrl (data){
		let tmp = data.split('#')
		let date = tmp[0] + " " + tmp[1] + " (GMT)"
		return date
	}

	static isoToPhrase(date){

		return moment(date).format("dddd D MMMM. YYYY à HH:mm")

	}

	static newDate(date){
		return moment(date)
	}


}
module.exports = urlDateParser
