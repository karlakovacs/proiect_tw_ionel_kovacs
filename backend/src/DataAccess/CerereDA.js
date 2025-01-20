import Cerere from '../Entities/Cerere.js';

async function createCerere(data) {
    return await Cerere.create(data);
}

async function getCereri() {
    return await Cerere.findAll();
}

async function getCerereById(id) {
    return await Cerere.findByPk(id);
}

async function deleteCerere(id) {
    let object = await Cerere.findByPk(id);
    if (!object) {
        console.log('X');
        return;
    }
    return await object.destroy();
}

async function updateCerere(id, data) {
    let object = await Cerere.findByPk(id);
    if (!object) {
        console.log('X');
        return null;
    }
    return await object.update(data);
}

export { createCerere, getCereri, getCerereById, deleteCerere, updateCerere };
