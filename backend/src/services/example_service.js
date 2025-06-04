import db from "#src/database.js";

// for example purpose, querying all users
async function Example() {
    try {
        const result = 'example data'
        return result;

    } catch (err) {
        console.log(err);
    }

}

export {
    Example,
}
