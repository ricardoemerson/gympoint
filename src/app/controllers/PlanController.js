import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async show(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    return res.json(plan);
  }

  async store(req, res) {
    // Validation.
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    // Check if the plan is already registered.
    const planExists = await Plan.findOne({ where: { title: req.body.title } });

    if (planExists) {
      return res.status(422).json({ error: 'Plan already exists.' });
    }

    // Create a new plan.
    const plan = await Plan.create(req.body);

    return res.status(201).json(plan);
  }

  async update(req, res) {
    // Validation.
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(422).json({ error: `Validation fails: ${ err.message }` });
    }

    // Find plan by id.
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    // Update plan.
    const updatedPlan = await plan.update(req.body);

    return res.json(updatedPlan);
  }

  async delete(req, res) {
    // Find plan by id.
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    // Delete plan.
    await plan.destroy();

    return res.status(204).json();
  }
}

export default new PlanController();
