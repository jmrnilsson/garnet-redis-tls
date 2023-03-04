import unittest
from redis import Redis


class RedisTests(unittest.TestCase):

  def test_azure_recommended_self_signed_ca(self):
    r = Redis.from_url( url='rediss://:@localhost:7000/0',
        # password='password',
        ssl_cert_reqs='required',
        ssl_keyfile='./redis-az-ca/az-tls/redis.key',
        ssl_certfile='./redis-az-ca/az-tls/redis.crt',
        ssl_ca_certs='./redis-az-ca/az-tls/ca.crt'
    )

    r.set('foo', 'bar')
    value = r.get('foo')
    print(value)
    self.assertEquals(value, "bar")

  def test_azure_recommended_self_signed_ca_no_certs(self):
    r = Redis.from_url( url='rediss://:@localhost:7000/0',
        # password='password',
        ssl_cert_reqs='required'
    )

    r.set('foo', 'bar')
    value = r.get('foo')
    print(value)
    self.assertEquals(value, "bar")

  def test_official_documentation_self_signed(self):
    r = Redis.from_url( url='rediss://:@localhost:7002/0',
        # password='password',
        ssl_cert_reqs='required',
        ssl_keyfile='./redis/tests/tls/redis.key',
        ssl_certfile='./redis/tests/tls/redis.crt',
        ssl_ca_certs='./redis/tests/tls/ca.crt'
    )

    r.set('foo', 'boo')
    value = r.get('foo')
    print(value)
    self.assertEqual(value, b"boo")

  def test_official_documentation_self_signed_no_certs(self):
    r = Redis.from_url( url='rediss://:@localhost:7002/0',
        # password='password',
        ssl_cert_reqs='required'
    )

    r.set('foo', 'nay')
    value = r.get('foo')
    print(value)
    self.assertEqual(value, b"nay")


if __name__ == "__main__":
  unittest.main()
