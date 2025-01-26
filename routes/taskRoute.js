import express from 'express';
import task from '../controller/task.js';

const router = express.Router();

router.route('/tarefas').post(
    task.create,
);

router.route('/tarefas/:taskId').get(
    task.detail,
);

router.route('/tarefas').get(
    task.list,
);

router.route('/tarefas/:taskId').put(
    task.update,
);

router.route('/tarefas/:taskId').delete(
    task.remove,
);

export default router;
