import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
export let errorRate = new Rate('errors');

export let options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  var url = 'http://localhost:3030/products?page=1&count=100';
  check(http.get(url), {
    'status is 200': (r) => r.status == 200,
  }) || errorRate.add(1);

  sleep(1);
}

