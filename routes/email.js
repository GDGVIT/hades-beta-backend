const router = require('express').Router();
const logger = require('../logging/logger');
const Email = require('../schemas/email');

const isValidEmail = mail => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);

router.post('/', async (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({ msg: 'missing email' });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(422).json({ msg: 'invalid email' });
  }

  if (await Email.exists({ email: req.body.email })) {
    return res.status(409).json({ msg: 'email already exists' });
  }

  try {
    await Email.create({ email: req.body.email });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      msg: 'something went wrong',
      err: err.toString()
    });
  }

  return res.status(201).json({ msg: 'email saved' });
});

// router.get('/', async (req, res) => {
//   try {
//     const emails = await Email.find({});
//     if (emails.length === 0) {
//       return res.status(404).json({ msg: 'emails not found' });
//     }

//     return res.status(200).json({
//       msg: 'emails found',
//       emails: emails.map(item => item.email)
//     });
//   } catch (err) {
//     logger.error(err);
//     return res.status(500).json({
//       msg: 'something went wrong',
//       err: err.toString()
//     });
//   }
// });

module.exports = router;
