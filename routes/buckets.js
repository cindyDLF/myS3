import { Router } from 'express';
import { pick } from 'lodash';
import fs from 'fs';
import Buckets from '../models/bucket';

const api = Router({ mergeParams: true });

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

api.get('/:id', async (req, res) => {
  try {
    const bucket = await Buckets.findOne({ where: { id: req.params.id } });
    if (bucket) {
      res.status(200).json({ data: { bucket }, meta: {} });
    } else {
      res.json({ err: "folder doesn't exists" });
    }
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/', async (req, res) => {
  try {
    const buckets = await Buckets.findAll({ where: { user_uuid: req.params.uuid } });
    if (buckets) {
      res.status(200).json({ data: { buckets } });
    }
  } catch (err) {
    res.status(400).json({ err: "directory doesn't created" });
  }
});

api.post('/', async (req, res) => {
  const { name } = req.body;
  const id = req.params.uuid;

  try {
    if (
      fs.existsSync(`/opt/workspace/myS3/${id}`)
      && !fs.existsSync(`/opt/workspace/myS3/${id}/${req.body.name}`)
    ) {
      const bucket = new Buckets({ name, user_uuid: id });
      await bucket.save();
      fs.mkdirSync(`/opt/workspace/myS3/${id}/${req.body.name}`, '0777');
    } else {
      console.log(`directory ${req.body.name} already exist`);
      res.status(400).json(`directory ${req.body.name} already exists`);
    }
    res.status(201).json({
      data: {
        user: { id, name },
      },
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

api.put('/:id', async (req, res) => {
  try {
    const bucket = await Buckets.findOne({ where: { id: req.params.id } });
    console.log(bucket.name);
    console.log(req.params.uuid);
    if (bucket && `/opt/workspace/myS3/${req.params.uuid}/${bucket.name}`) {
      const field = pick(req.body, ['name']);
      console.log(field);
      fs.renameSync(
        `/opt/workspace/myS3/${req.params.uuid}/${bucket.name}`,
        `/opt/workspace/myS3/${req.params.uuid}/${field.name}`,
      );
      await bucket.update(field);
    } else {
      res.status(400).json({ err: 'no directory with this name' });
    }
    // console.log(req.body);
    res.status(204).json({ data: bucket });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    const bucket = await Buckets.findOne({ where: { id: req.params.id } });

    deleteFolderRecursive(`/opt/workspace/myS3/${req.params.uuid}/${bucket.name}`);
    await bucket.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

api.head('/:id', async (req, res) => {
  console.log(bucket);
  try {
    const bucket = await Buckets.findOne({ where: { id: req.params.id } });
    if (bucket) {
      res.status(200).end();
    } else {
      res.status(400).end();
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

export default api;
