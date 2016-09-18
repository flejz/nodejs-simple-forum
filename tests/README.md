# Test Stack

## Integration

When an user tries to delete a topic
  And the topic is not from himself
    It should return an exception
  And the topic is from himself
    It should delete the topic

When an adm tries to delete a topic
  It should delete the topic


## Unit Tests

### User
When request an user by id
  It should return the register

When an user tries to register
  With any empty field
    It should return an exception
  With all fields correctly filled
    With password mismatching
      It should return an exception
    With password matching
      With an existent username
        It should return an exception
      With an unexistant username
        It should return the inserted register

When an user tries to login
  With any empty field
    It should return an exception
  With invalid Credentials
    It should return an exception
  With valid credentials
    It should return the user register

### Topic
When requesting all the topics
  It should retrieve a list of all the topics ordered by date
When requesting a topic by id
  It should return the register

When an user or adm tries to add a topic
  With any empty field
    It should return an exception
  With all fields correctly filled
    It should return the inserted register

### Message
When requesting all the messages by topic
  It should retrieve a list of all the messages ordered by date
  It should retrieve the top_message as first

When an user or adm tries to add a message
  With any empty field
    It should return an exception
  With all fields correctly filled
    It should return the inserted register

When an user tries to delete a message
  And the message is not from himself
    It should return an exception
  And the topic is from himself
    It should delete the message

When an adm tries to delete a message
  It should delete the message
