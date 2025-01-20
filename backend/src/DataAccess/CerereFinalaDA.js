import CerereFinala from '../Entities/CerereFinala.js';

async function createCerereFinala(data) {
    return await CerereFinala.create(data);
}

async function getCereriFinale() {
    return await CerereFinala.findAll();
}

async function getCerereFinalaById(id) {
    return await CerereFinala.findByPk(id);
}

async function deleteCerereFinala(id) {
    let object = await CerereFinala.findByPk(id);
    if (!object) {
        console.log('X');
        return;
    }
    return await object.destroy();
}

async function updateCerereFinala(id, data) {
    let object = await CerereFinala.findByPk(id);
    if (!object) {
        console.log('X');
        return null;
    }
    return await object.update(data);
}

export { createCerereFinala, getCereriFinale, getCerereFinalaById, deleteCerereFinala, updateCerereFinala };
