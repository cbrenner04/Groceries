# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_01_17_142447) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "book_list_items", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "book_list_id", null: false
    t.string "author"
    t.string "title"
    t.boolean "purchased", default: false, null: false
    t.boolean "read", default: false, null: false
    t.datetime "archived_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_list_id"], name: "index_book_list_items_on_book_list_id"
    t.index ["user_id"], name: "index_book_list_items_on_user_id"
  end

  create_table "grocery_list_items", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "grocery_list_id", null: false
    t.string "product", null: false
    t.string "quantity", default: "1", null: false
    t.boolean "purchased", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at"
    t.boolean "refreshed", default: false, null: false
    t.index ["grocery_list_id"], name: "index_grocery_list_items_on_grocery_list_id"
    t.index ["user_id"], name: "index_grocery_list_items_on_user_id"
  end

  create_table "lists", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at"
    t.boolean "completed", default: false, null: false
    t.boolean "refreshed", default: false, null: false
    t.string "type"
  end

  create_table "music_list_items", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "music_list_id", null: false
    t.string "title"
    t.string "artist"
    t.string "album"
    t.boolean "purchased", default: false, null: false
    t.datetime "archived_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["music_list_id"], name: "index_music_list_items_on_music_list_id"
    t.index ["user_id"], name: "index_music_list_items_on_user_id"
  end

  create_table "to_do_list_items", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "to_do_list_id", null: false
    t.string "task", null: false
    t.integer "assignee_id"
    t.datetime "due_by"
    t.boolean "completed", default: false, null: false
    t.boolean "refreshed", default: false, null: false
    t.datetime "archived_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["to_do_list_id"], name: "index_to_do_list_items_on_to_do_list_id"
    t.index ["user_id"], name: "index_to_do_list_items_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.integer "invited_by_id"
    t.integer "invitations_count", default: 0
    t.boolean "is_test_account", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_lists", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "list_id", null: false
    t.boolean "has_accepted"
    t.string "permissions", default: "write", null: false
    t.index ["list_id"], name: "index_users_lists_on_list_id"
    t.index ["user_id", "list_id"], name: "index_users_lists_on_user_id_and_list_id", unique: true
    t.index ["user_id"], name: "index_users_lists_on_user_id"
  end

  add_foreign_key "book_list_items", "lists", column: "book_list_id"
  add_foreign_key "book_list_items", "users"
  add_foreign_key "grocery_list_items", "lists", column: "grocery_list_id"
  add_foreign_key "grocery_list_items", "users"
  add_foreign_key "music_list_items", "lists", column: "music_list_id"
  add_foreign_key "music_list_items", "users"
  add_foreign_key "to_do_list_items", "lists", column: "to_do_list_id"
  add_foreign_key "to_do_list_items", "users"
  add_foreign_key "to_do_list_items", "users", column: "assignee_id"
end
