import CryptoJS from 'crypto-js';

// 獲取Cookie資料的函數
export function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
}

// 刪除所有cookie的函數
export function deleteAllCookies() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName] = cookie.split('=');
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
  }


// 密碼加密
export function encrypt( message ){
  const secretKey = process.env.REACT_APP_SECRETKEY;
  const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_IV);
  const encrypted = CryptoJS.AES.encrypt(message, secretKey, {iv}).toString();
  // const ivString = iv.toString(CryptoJS.enc.Base64);
  // console.log('加密後的數據:', encrypted);
  // console.log('IV:', ivString);
  return encrypted
}


// 密碼解密
export function decrypt( encrypted ){
  const secretKey = process.env.REACT_APP_SECRETKEY;
  const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_IV);
  const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey, {iv}).toString(CryptoJS.enc.Utf8);
  // console.log(decrypted);
  return decrypted
}