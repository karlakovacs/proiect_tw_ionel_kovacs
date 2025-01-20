import Sesiune from '../Entities/Sesiune.js';

async function createSesiune(data) {
    return await Sesiune.create(data);
}

async function getSesiuni() {
    return await Sesiune.findAll();
}

async function getSesiuneById(id) {
    return await Sesiune.findByPk(id);
}

async function deleteSesiune(id) {
    let object = await Sesiune.findByPk(id);
    if (!object) {
        console.log('X');
        return null;
    }
    return await object.destroy();
}

async function updateSesiune(id, data) {
    let object = await Sesiune.findByPk(id);
    if (!object) {
        console.log('X');
        return null;
    }
    return await object.update(data);
}

export { createSesiune, getSesiuni, getSesiuneById, deleteSesiune, updateSesiune };
