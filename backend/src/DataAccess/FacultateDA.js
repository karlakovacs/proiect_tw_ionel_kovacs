import Facultate from '../Entities/Facultate.js';

async function createFacultate(data) {
    return await Facultate.create(data);
}

async function getFacultati() {
    return await Facultate.findAll();
}

async function getFacultateById(id) {
    return await Facultate.findByPk(id);
}

async function deleteFacultate(id) {
    let object = await Facultate.findByPk(id);
    if (!object) {
        console.log('X');
        return;
    }
    return await object.destroy();
}

async function updateFacultate(id, data) {
    let object = await Facultate.findByPk(id);
    if (!object) {
        console.log('X');
        return null;
    }
    return await object.update(data);
}

export { createFacultate, getFacultati, getFacultateById, deleteFacultate, updateFacultate };
