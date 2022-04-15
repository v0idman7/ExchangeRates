import axios from "axios";

const API = axios.create({
  baseURL: 'https://www.nbrb.by/api/exrates/rates'
});

async function getRates(periodicity=0) {
  return API.get('', {
    params: { periodicity }
  }).then(res => {
    const rates = {}
    res.data.forEach(({ Cur_ID, Cur_Name, Cur_Scale, Cur_Abbreviation, Cur_OfficialRate }) => {
      rates[Cur_ID] = {
        id: Cur_ID,
        name: `${Cur_Scale} ${Cur_Name}`,
        abreviation: Cur_Abbreviation,
        rate: `${Cur_Scale} ${Cur_Abbreviation} = ${priceFormatter(Cur_OfficialRate)}`
      }
    })
    return rates
  })
}


async function getDynamics(id, startDate, endDate=new Date()) {
  return API.get(`/dynamics/${id}`, {
    params: {
      startdate: startDate.toISOString(),
      enddate: endDate.toISOString()
    }
  }).then(res => {
    return res.data.map(({ Date: date, Cur_OfficialRate: price }) => {
      return {
        date: new Date(date).toLocaleDateString(),
        price: priceFormatter(price)
      }
    })
  })
}

function priceFormatter(value) {
  const price = parseFloat(value) || 0
  return price.toLocaleString("ru-RU", { style: 'currency', currency:"BYN" })
}

export { getRates, getDynamics }