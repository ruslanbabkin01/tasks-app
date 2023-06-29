const formidable = require('formidable')
const path = require('path')
const fs = require('fs').promises
const parseFrom = require('../helpers')

const upload = async (req, res, next) => {
  // шлях де зберігається файл при початковому завантаженні
  const uploadDir = path.join(process.cwd(), 'uploads')
  // шлях де зберігається файл остаточно
  const storeImage = path.join(process.cwd(), 'images')

  const form = formidable({ uploadDir, maxFileSize: 2 * 1024 * 1024 })

  const { fields, files } = await parseFrom(form, req)

  // припускаємо, що ім'я поля з файлом дорівнює picture.Отримуємо шлях де знаходиться файл temporaryName і його оригінальне ім'я name
  const { path: temporaryName, name } = files.picture
  const { description } = fields

  // даємо нове ім'я файлу, у нашому випадку залишаємо його тим самим
  const fileName = path.join(storeImage, name)

  // переносимо файл у постійне сховище
  try {
    await fs.rename(temporaryName, fileName)
  } catch (err) {
    // Якщо сталася помилка перенесення - видаляємо тимчасовий файл
    await fs.unlink(temporaryName)
    return next(err)
  }
}

module.exports = upload
