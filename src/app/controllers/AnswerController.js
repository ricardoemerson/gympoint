import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class AnswerController {
  async index(req, res) {
    const answers = await HelpOrder.findAll({
      where: {
        answer: null,
      },
    });

    return res.json(answers);
  }

  async store(req, res) {
    // Validation.
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    const { help_order_id } = req.params;

    // Check if the help order exists.
    const helpOrder = await HelpOrder.findByPk(help_order_id, {
      include: {
        model: Student,
        as: 'student',
        attributes: ['id', 'name'],
      },
    });

    if (!helpOrder) {
      return res.status(404).json({ error: 'Help order not found.' });
    }

    // Update an answer.
    const { answer } = req.body;

    const helpOrderUpdated = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    return res.json(helpOrderUpdated);
  }
}

export default new AnswerController();
