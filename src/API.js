import axios from "axios";
import config from "api-config";

const instance = axios.create({
  baseURL: config.orderAPIUrl,
  timeout: 30000,
  headers: {
    'X-username': 'client1',
    'X-orgName': 'org1'
  }
});

export async function reset() {
  return await instance.post('/transfer/init');
}

export async function createOrder() {
  return await instance.post('/transfer/start', {
    'Owner': 'Manufacturer',
    'Count': '10'
  })
}

export async function requestShipping() {
  await instance.post('/transfer/accept');

  await instance.post('/transfer/request', {
    'Owner': 'ShippingCompany',
    'Count': '10'
  });

}

export async function startShipping() {
  await instance.post('/transfer/accept');

  await instance.post('/transfer/request', {
    'Owner': 'Retailer',
    'Count': '9'
  });
}

export async function finishOrder() {
  await instance.post('/transfer/accept');

  await instance.post('/transfer/complete');
}

export async function changeStage(stageId) {
  await axios.request({
    url: config.stageAPIUrl,
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    data: {
      "seqNO": stageId
    },
    timeout: 30000
  });
}