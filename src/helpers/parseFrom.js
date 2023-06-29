// парсинг даних з форми, обгортка повертає проміс із результатами парсингу форми.
const parseFrom = (form, req) => {
  return new Promise((resolve, reject) => {
    // викликає callback функцію, в яку передається три параметри, err помилка якщо вона сталася, fields це об'єкт який містить звичайні поля форми та останнім йде параметр files , який може бути масивом, якщо дозволено мультизавантаження файлів, або об'єкт якщо файл завантажується один.
    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err)
        return reject(err)
      }
      resolve({ fields, files })
    })
  })
}

// form.parse(req, (err, fields, files) => {
//   if (err) {
//     next(err)
//     return
//   }
//   res.json({ fields, files })
// })

module.exports = parseFrom
