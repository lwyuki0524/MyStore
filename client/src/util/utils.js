// 從Cookie中獲取userID的函數
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
