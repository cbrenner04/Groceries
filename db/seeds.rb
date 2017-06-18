user_emails = %w(foo@ex.co bar@ex.co baz@ex.co)
user_names = %w(Foo Bar Baz)
user_emails.zip(user_names) do |email, first_name|
  User.create!(
    email: email,
    password: 'asdfasdf',
    password_confirmation: 'asdfasdf',
    first_name: first_name
  )
end

list_names = %w(foobar foobaz)
list_names.each { |list| List.create!(name: list) }

UsersList.create!(
  user: User.find_by(email: 'foo@ex.co'),
  list: List.find_by(name: 'foobar')
)

UsersList.create!(
  user: User.find_by(email: 'bar@ex.co'),
  list: List.find_by(name: 'foobar')
)

UsersList.create!(
  user: User.find_by(email: 'baz@ex.co'),
  list: List.find_by(name: 'foobar')
)

UsersList.create!(
  user: User.find_by(email: 'foo@ex.co'),
  list: List.find_by(name: 'foobaz')
)

item_names = %w(apples bananas oranges chocolate beer)

item_names.each do |item|
  Item.create!(
    user: User.find_by(email: 'foo@ex.co'),
    list: List.find_by(name: 'foobar'),
    name: item,
    quantity: (1..10).to_a.sample,
    quantity_name: %w(bag bunch case).sample
  )
end
