function throwEx(message) {

    throw message;
}

export class TaggedObjectType {

    constructor(name, id) {

        this.id = typeof (id) === 'number'
            ? id
            : throwEx(typeof (id) + ' isn\'t a number');
        this.name = name;
    }
}

export default {

    ANIME: new TaggedObjectType('Animé', 1),
    GAME: new TaggedObjectType('Jeu', 2),
    POST: new TaggedObjectType('Article', 3)
};