import axios from "axios";


const instance = axios.create({
  baseURL: 'http://beer-supplychain-alb-2109300575.ap-northeast-2.elb.amazonaws.com',
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
