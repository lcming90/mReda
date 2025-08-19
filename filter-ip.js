/**
 * Sub-Store Rule Script
 * 过滤出「前三段都是三位数的 IP 节点」
 */

function isThreeDigitIP(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.slice(0, 3).every(n => {
    const num = Number(n);
    return num >= 100 && num <= 255;
  });
}

module.exports = {
  async onProxy(proxy, utils) {
    let host = proxy.server;

    // 如果是域名 → 解析成 IP
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      try {
        host = await utils.dnsResolve(host);
      } catch (e) {
        return null; // 域名解析失败 → 丢弃
      }
    }

    // 判断是否符合「前三段都是三位数」
    if (isThreeDigitIP(host)) {
      return proxy; // 保留
    } else {
      return null; // 丢弃
    }
  }
};
