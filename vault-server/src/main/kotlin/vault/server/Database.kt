package vault.server

import com.mongodb.MongoClientOptions
import com.mongodb.ServerAddress
import org.litote.kmongo.*
import vault.data.TaggedObject
import vault.data.TaggedObjectType
import java.util.*
import kotlin.NoSuchElementException

object Database {

    private val __self__ = KMongo.createClient(ServerAddress(configuration.mongoHost,
                                                             configuration.mongoPort),
                                               options = MongoClientOptions.builder()
                                                       .socketTimeout(5000)
                                                       .serverSelectionTimeout(5000)
                                                       .connectTimeout(5000)
                                                       .build())
            .getDatabase(configuration.mongoName)

    private val Objects = __self__.getCollection<TaggedObject>(collectionName = "objects")
    private val Users = __self__.getCollection<User>(collectionName = "users")

    fun getAllObjectsOfType(type: TaggedObjectType? = null) =
            (if (type == null)
                Objects.find()
                        .sort(orderBy(TaggedObject::name,
                                      ascending = true))
            else
                (Objects.find(TaggedObject::type eq type)
                        .sort(orderBy(TaggedObject::name,
                                      ascending = true))) as Iterable<TaggedObject>)
                    .toList()

    fun getObject(uuid: UUID) =
            Objects.findOne(TaggedObject::uuid eq uuid)
                    ?: throw NoSuchElementException("Can't find object with uuid=$uuid")

    fun searchObjects(
            query: String,
            offset: Int = 0) =
            (Objects.find()
                    .apply {

                        query.toLowerCase()
                                .split(' ')
                                .forEach { queryTerm ->
                                    if (queryTerm.startsWith("tag:") && !queryTerm.substringAfter("tag:").isEmpty())
                                        filter(TaggedObject::tags contains queryTerm.substringAfter("tag:"))
                                    else
                                        filter(TaggedObject::name.regex(queryTerm,
                                                                        "i"))
                                }
                    }
                    .sort(orderBy(TaggedObject::name,
                                  ascending = true))
                    .skip(offset)
                    .limit(10) as Iterable<TaggedObject>)
                    .toList()

    fun getLatestObjects() =
            (Objects.find()
                    .sort(orderBy(TaggedObject::added,
                                  ascending = false))
                    .limit(10) as Iterable<TaggedObject>)
                    .toList()

    fun hasObject(uuid: UUID) =
            Objects.findOne(TaggedObject::uuid eq uuid) != null

    fun insertObject(obj: TaggedObject) =
            Objects.insertOne(obj)

    fun updateObject(
            uuid: UUID,
            obj: TaggedObject
    ) {
        if (hasObject(uuid))
            Objects.updateOne(TaggedObject::uuid eq uuid,
                              obj)
        else
            insertObject(obj)
    }

    fun getUser(uuid: UUID) =
            Users.findOne(User::uuid eq uuid)
                    ?: throw NoSuchElementException("Can't find user with uuid=$uuid")

    fun getUser(username: String) =
            Users.findOne(User::username eq username)
                    ?: throw NoSuchElementException("Can't find user with username=$username")

    fun hasUser(username: String) =
            Users.findOne(User::username eq username) != null

    fun insertUser(user: User) =
            Users.insertOne(user)

    fun getSimpleUser(uuid: UUID) =
            getUser(uuid).toSimpleUser()
}