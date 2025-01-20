import Profesor from '../Entities/Profesor.js';

async function createProfesor(data) {
    return await Profesor.create(data);
}

async function getProfesori() {
    return await Profesor.findAll();
}

async function getProfesorById(id) {
    return await Profesor.findByPk(id);
}

async function deleteProfesor(id) {
    let object = await Profesor.findByPk(id);
    if (!object) {
        console.log('X');
        return;
    }
    return await object.destroy();
}

async function updateProfesor(id, data) {
    let object = await Profesor.findByPk(id);
    if (!object) {
        console.log('X');
        return null;
    }
    return await object.update(data);
}

export { createProfesor, getProfesori, getProfesorById, deleteProfesor, updateProfesor };
