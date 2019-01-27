# frozen_string_literal: true

require "rails_helper"

RSpec.describe ListsController do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }

  before { sign_in user }

  describe "GET #index" do
    describe "format HTML" do
      it "renders index" do
        get :index

        expect(response).to render_template :index
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :index, format: :json

        response_body = JSON.parse(response.body)
        expect(response).to be_successful
        expect(response_body["accepted_lists"].count)
          .to eq List.accepted(user).count
        expect(response_body["not_accepted_lists"].count)
          .to eq List.not_accepted(user).count
      end
    end
  end

  describe "GET #show" do
    it "assigns the requested list as @list" do
      get :show, params: {
        id: list.id
      }

      expect(assigns(:list)).to eq list
    end

    describe "format HTML" do
      it "renders index" do
        get :show, params: {
          id: list.id
        }
        expect(response).to render_template :index
      end
    end

    describe "format JSON" do
      describe "when BookList" do
        let(:list) { BookList.create!(name: "foo", owner: user) }

        it "responds with success and correct payload" do
          BookListItem.create!(
            user_id: user.id,
            book_list_id: list.id,
            title: "foo",
            purchased: false
          )
          BookListItem.create!(
            user_id: user.id,
            book_list_id: list.id,
            title: "foobar",
            purchased: true
          )
          get :show, params: {
            id: list.id
          }, format: :json

          response_body = JSON.parse(response.body)
          expect(response).to be_successful
          expect(response_body["current_user_id"]).to eq user.id
          expect(response_body["list"]).to include(
            "id" => list.id,
            "name" => list.name
          )
          expect(response_body["not_purchased_items"].first["id"]).to eq(
            BookListItem.where(book_list: list)
            .not_archived.ordered.not_purchased.first.id
          )
          expect(response_body["purchased_items"].first["id"]).to eq(
            BookListItem.where(book_list: list)
            .not_archived.ordered.purchased.first.id
          )
        end
      end

      describe "when GroceryList" do
        let(:list) { GroceryList.create!(name: "foo", owner: user) }

        it "responds with success and correct payload" do
          GroceryListItem.create!(
            user_id: user.id,
            grocery_list_id: list.id,
            product: "foo",
            quantity: 1,
            purchased: false
          )
          GroceryListItem.create!(
            user_id: user.id,
            grocery_list_id: list.id,
            product: "foobar",
            quantity: 1,
            purchased: true,
            refreshed: false
          )
          GroceryListItem.create!(
            user_id: user.id,
            grocery_list_id: list.id,
            product: "foobar",
            quantity: 1,
            purchased: true,
            refreshed: true
          )
          get :show, params: {
            id: list.id
          }, format: :json

          response_body = JSON.parse(response.body)
          expect(response).to be_successful
          expect(response_body["current_user_id"]).to eq user.id
          expect(response_body["list"]).to include(
            "id" => list.id,
            "name" => list.name
          )
          expect(response_body["not_purchased_items"].first["id"]).to eq(
            GroceryListItem.where(grocery_list: list)
            .not_archived.ordered.not_purchased.first.id
          )
          expect(response_body["purchased_items"].first["id"]).to eq(
            GroceryListItem.where(grocery_list: list)
            .not_archived.ordered.purchased.not_refreshed.first.id
          )
        end
      end

      describe "when MusicList" do
        let(:list) { MusicList.create!(name: "foo", owner: user) }

        it "responds with success and correct payload" do
          MusicListItem.create!(
            user_id: user.id,
            music_list_id: list.id,
            title: "foo",
            purchased: false
          )
          MusicListItem.create!(
            user_id: user.id,
            music_list_id: list.id,
            title: "foobar",
            purchased: true
          )
          get :show, params: {
            id: list.id
          }, format: :json

          response_body = JSON.parse(response.body)
          expect(response).to be_successful
          expect(response_body["current_user_id"]).to eq user.id
          expect(response_body["list"]).to include(
            "id" => list.id,
            "name" => list.name
          )
          expect(response_body["not_purchased_items"].first["id"]).to eq(
            MusicListItem.where(music_list: list)
            .not_archived.ordered.not_purchased.first.id
          )
          expect(response_body["purchased_items"].first["id"]).to eq(
            MusicListItem.where(music_list: list)
            .not_archived.ordered.purchased.first.id
          )
        end
      end

      describe "when ToDoList" do
        let(:list) { ToDoList.create!(name: "foo", owner: user) }

        it "responds with success and correct payload" do
          ToDoListItem.create!(
            user_id: user.id,
            to_do_list_id: list.id,
            task: "foo",
            completed: false
          )
          ToDoListItem.create!(
            user_id: user.id,
            to_do_list_id: list.id,
            task: "foobar",
            completed: true,
            refreshed: false
          )
          ToDoListItem.create!(
            user_id: user.id,
            to_do_list_id: list.id,
            task: "foobar",
            completed: true,
            refreshed: true
          )
          get :show, params: {
            id: list.id
          }, format: :json

          response_body = JSON.parse(response.body)
          expect(response).to be_successful
          expect(response_body["current_user_id"]).to eq user.id
          expect(response_body["list"]).to include(
            "id" => list.id,
            "name" => list.name
          )
          expect(response_body["not_purchased_items"].first["id"]).to eq(
            ToDoListItem.where(to_do_list: list)
            .not_archived.ordered.not_completed.first.id
          )
          expect(response_body["purchased_items"].first["id"]).to eq(
            ToDoListItem.where(to_do_list: list)
            .not_archived.ordered.completed.not_refreshed.first.id
          )
        end
      end
    end
  end

  describe "GET #edit" do
    describe "format HTML" do
      it "renders index" do
        get :edit, params: {
          id: list.id
        }

        expect(response).to render_template :index
      end
    end

    describe "format JSON" do
      it "responds with success and correct payload" do
        get :edit, params: {
          id: list.id
        }, format: :json

        expect(JSON.parse(response.body).to_h).to include(
          "archived_at" => list[:archived_at],
          "completed" => list[:completed],
          "id" => list[:id],
          "name" => list[:name],
          "refreshed" => list[:refreshed]
        )
      end
    end
  end

  describe "POST #create" do
    describe "with valid params" do
      describe "when type is ToDoList" do
        it "creates a new list" do
          expect do
            post :create, params: {
              list: {
                user_id: user.id,
                name: "foo",
                type: "ToDoList"
              }
            }
          end.to change(ToDoList, :count).by 1
        end
      end

      describe "when type is BookList" do
        it "creates a new list" do
          expect do
            post :create, params: {
              list: {
                user_id: user.id,
                name: "foo",
                type: "BookList"
              }
            }
          end.to change(BookList, :count).by 1
        end
      end

      describe "when type is MusicList" do
        it "creates a new list" do
          expect do
            post :create, params: {
              list: {
                user_id: user.id,
                name: "foo",
                type: "MusicList"
              }
            }
          end.to change(MusicList, :count).by 1
        end
      end

      describe "when type is GroceryList" do
        it "creates a new list" do
          expect do
            post :create, params: {
              list: {
                user_id: user.id,
                name: "foo",
                type: "GroceryList"
              }
            }
          end.to change(GroceryList, :count).by 1
        end
      end

      describe "when type is not present" do
        it "creates a new list" do
          expect do
            post :create, params: {
              list: {
                user_id: user.id,
                name: "foo"
              }
            }
          end.to change(GroceryList, :count).by 1
        end
      end
    end

    describe "with invalid params" do
      it "re-renders the 'new' template" do
        post :create, params: {
          list: {
            name: nil
          }
        }, format: "json"

        expect(JSON.parse(response.body))
          .to eq("name" => ["can't be blank"])
      end
    end
  end

  describe "PUT #update" do
    describe "with valid params" do
      it "updates a list" do
        update_list = create :list, name: "foo"
        put :update, params: {
          id: update_list.id,
          list: {
            name: "bar"
          }
        }
        update_list.reload

        expect(update_list.name).to eq "bar"
      end
    end

    describe "with invalid params" do
      it "re-renders the 'edit' template" do
        list = create :list
        put :update, params: {
          id: list.id,
          list: {
            name: nil
          }
        }, format: "json"

        expect(JSON.parse(response.body))
          .to eq("name" => ["can't be blank"])
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys a list" do
      delete_list = create :list, name: "foo"
      delete :destroy, params: {
        id: delete_list.id
      }

      expect(List.not_archived).to_not include delete_list
    end
  end

  describe "POST #refresh_list" do
    describe "when old list is a BookList" do
      it "creates new list" do
        list = BookList.create!(name: "NewBookList", owner: user)
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(List, :count).by 1
      end

      it "creates new items" do
        list = BookList.create!(name: "NewBookList", owner: user)
        BookListItem.create!(
          user: user,
          book_list: list,
          title: "foo"
        )
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(BookListItem, :count).by 1
      end
    end

    describe "when old list is a GroceryList" do
      it "creates new list" do
        list = GroceryList.create!(name: "NewGroceryList", owner: user)
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(List, :count).by 1
      end

      it "creates new items" do
        list = GroceryList.create!(name: "NewGroceryList", owner: user)
        GroceryListItem.create!(
          user: user,
          grocery_list: list,
          product: "foo",
          quantity: 1
        )
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(GroceryListItem, :count).by 1
      end
    end

    describe "when old list is a BookList" do
      it "creates new list" do
        list = MusicList.create!(name: "NewMusicList", owner: user)
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(List, :count).by 1
      end

      it "creates new items" do
        list = MusicList.create!(name: "NewMusicList", owner: user)
        MusicListItem.create!(
          user: user,
          music_list: list,
          title: "foo"
        )
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(MusicListItem, :count).by 1
      end
    end

    describe "when old list is a GroceryList" do
      it "creates new list" do
        list = ToDoList.create!(name: "NewToDoList", owner: user)
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(List, :count).by 1
      end

      it "creates new items" do
        list = ToDoList.create!(name: "NewToDoList", owner: user)
        ToDoListItem.create!(
          user: user,
          to_do_list: list,
          task: "foo"
        )
        expect do
          post :refresh_list, params: {
            id: list.id
          }
        end.to change(ToDoListItem, :count).by 1
      end
    end
  end
end
