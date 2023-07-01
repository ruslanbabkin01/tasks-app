// Парсинг даних з форми, обгортка повертає проміс із результатами парсингу форми
const parseForm = (form, req) => {
  return new Promise((resolve, reject) => {
    // Викликає callback функцію, в яку передається три параметри:
    // - err помилка якщо вона сталася;
    // - fields це об'єкт який містить звичайні поля форми;
    // - files, який може бути масивом, якщо дозволено мультизавантаження файлів, або об'єкт якщо файл завантажується один
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      resolve({ fields, files })
    })
  })
}

module.exports = parseForm
