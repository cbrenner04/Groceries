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
        expect(response_body["pending_lists"].count)
          .to eq List.pending(user).count
        expect(response_body["is_user_signed_in"]).to eq true
        expect(response_body["current_user_id"]).to eq user.id
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

    context "when a user has not been invited" do
      before { list.users_lists.delete_all }

      describe "format HTML" do
        it "redirects to lists_path" do
          get :show, params: {
            id: list.id
          }
          expect(response).to redirect_to lists_path
        end
      end

      describe "format JSON" do
        it "redirects to lists_path" do
          get :show, params: {
            id: list.id
          }, format: :json
          expect(response).to redirect_to lists_path
        end
      end
    end

    context "when a user has been invited" do
      context "when invitee has not accepted" do
        before do
          list.users_lists.find_by(user: user).update!(has_accepted: nil)
        end

        describe "format HTML" do
          it "redirects to lists_path" do
            get :show, params: {
              id: list.id
            }
            expect(response).to redirect_to lists_path
          end
        end

        describe "format JSON" do
          it "redirects to lists_path" do
            get :show, params: {
              id: list.id
            }, format: :json
            expect(response).to redirect_to lists_path
          end
        end
      end

      context "when invitee has accepted" do
        describe "format HTML" do
          it "renders index" do
            get :show, params: {
              id: list.id
            }
            expect(response).to render_template :index
          end
        end

        describe "format JSON" do
          before { create :users_list, user: user, list: list }

          describe "when BookList" do
            let(:list) { BookList.create!(name: "foo", owner: user) }

            it "responds with success and correct payload" do
              BookListItem.create!(
                user_id: user.id,
                book_list_id: list.id,
                title: "foo",
                purchased: false,
                category: "foo"
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
              expect(response_body["categories"]).to include "foo"
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
                purchased: false,
                category: "foo"
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
              expect(response_body["categories"]).to include "foo"
            end
          end

          describe "when MusicList" do
            let(:list) { MusicList.create!(name: "foo", owner: user) }

            it "responds with success and correct payload" do
              MusicListItem.create!(
                user_id: user.id,
                music_list_id: list.id,
                title: "foo",
                purchased: false,
                category: "foo"
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
              expect(response_body["categories"]).to include "foo"
            end
          end

          describe "when ToDoList" do
            let(:list) { ToDoList.create!(name: "foo", owner: user) }

            it "responds with success and correct payload" do
              ToDoListItem.create!(
                user_id: user.id,
                to_do_list_id: list.id,
                task: "foo",
                completed: false,
                category: "foo"
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
              expect(response_body["categories"]).to include "foo"
            end
          end
        end
      end
    end
  end

  describe "GET #edit" do
    describe "format HTML" do
      context "when user is not owner" do
        it "redirects to lists_path" do
          get :edit, params: {
            id: list.id
          }

          expect(response).to redirect_to lists_path
        end
      end

      context "when user is owner" do
        before { list.update!(owner: user) }

        it "renders index" do
          get :edit, params: {
            id: list.id
          }

          expect(response).to render_template :index
        end
      end
    end

    describe "format JSON" do
      context "when user is not owner" do
        it "redirects to lists_path" do
          get :edit, params: {
            id: list.id
          }, format: :json

          expect(response).to redirect_to lists_path
        end
      end

      context "when user is owner" do
        before { list.update!(owner: user) }

        it "responds with success and correct payload" do
          get :edit, params: {
            id: list.id
          }, format: :json
          response_body = JSON.parse(response.body).to_h

          expect(response_body["current_user_id"]).to eq user.id
          expect(response_body["list"]).to include(
            "archived_at" => list[:archived_at],
            "completed" => list[:completed],
            "id" => list[:id],
            "name" => list[:name],
            "refreshed" => list[:refreshed]
          )
        end
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
          expect(ToDoList.last.owner).to eq user
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
          expect(BookList.last.owner).to eq user
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
          expect(MusicList.last.owner).to eq user
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
          expect(GroceryList.last.owner).to eq user
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
    context "when user is not owner" do
      it "redirects to lists_path" do
        put :update, params: {
          id: list.id,
          list: {
            name: "bar"
          }
        }

        expect(response).to redirect_to lists_path
      end
    end

    context "when user is owner" do
      describe "with valid params" do
        it "updates a list" do
          update_list = create :list, name: "foo", owner: user
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
          list = create :list, owner: user
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
  end

  describe "DELETE #destroy" do
    context "when user is not owner" do
      it "redirects to lists_path" do
        delete :destroy, params: {
          id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    context "when user is owner" do
      it "destroys a list" do
        delete_list = create :list, name: "foo", owner: user
        delete :destroy, params: {
          id: delete_list.id
        }

        expect(List.not_archived).not_to include delete_list
      end
    end
  end

  describe "POST #refresh_list" do
    context "when user is not owner" do
      it "redirects to lists_path" do
        post :refresh_list, params: {
          id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    context "when user is owner" do
      describe "when old list is a BookList" do
        it "creates new list" do
          list = BookList.create!(name: "NewBookList",
                                  owner: user,
                                  completed: true)
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(List, :count).by 1
        end

        it "creates new items" do
          list = BookList.create!(name: "NewBookList",
                                  owner: user,
                                  completed: true)
          BookListItem.create!(
            user: user,
            book_list: list,
            title: "foo",
            category: "foo"
          )
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(BookListItem, :count).by 1
          new_list_item = BookListItem.last
          expect(new_list_item[:title]).to eq "foo"
          expect(new_list_item[:category]).to eq "foo"
        end
      end

      describe "when old list is a GroceryList" do
        it "creates new list" do
          list = GroceryList.create!(name: "NewGroceryList",
                                     owner: user,
                                     completed: true)
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(List, :count).by 1
        end

        it "creates new items" do
          list = GroceryList.create!(name: "NewGroceryList",
                                     owner: user,
                                     completed: true)
          GroceryListItem.create!(
            user: user,
            grocery_list: list,
            product: "foo",
            quantity: 1,
            category: "foo"
          )
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(GroceryListItem, :count).by 1
          new_list_item = GroceryListItem.last
          expect(new_list_item[:product]).to eq "foo"
          expect(new_list_item[:category]).to eq "foo"
        end
      end

      describe "when old list is a MusicList" do
        it "creates new list" do
          list = MusicList.create!(name: "NewMusicList",
                                   owner: user,
                                   completed: true)
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(List, :count).by 1
        end

        it "creates new items" do
          list = MusicList.create!(name: "NewMusicList",
                                   owner: user,
                                   completed: true)
          MusicListItem.create!(
            user: user,
            music_list: list,
            title: "foo",
            category: "foo"
          )
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(MusicListItem, :count).by 1
          new_list_item = MusicListItem.last
          expect(new_list_item[:title]).to eq "foo"
          expect(new_list_item[:category]).to eq "foo"
        end
      end

      describe "when old list is a ToDoList" do
        it "creates new list" do
          list = ToDoList.create!(name: "NewToDoList",
                                  owner: user,
                                  completed: true)
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(List, :count).by 1
        end

        it "creates new items" do
          list = ToDoList.create!(name: "NewToDoList",
                                  owner: user,
                                  completed: true)
          ToDoListItem.create!(
            user: user,
            to_do_list: list,
            task: "foo",
            category: "foo"
          )
          expect do
            post :refresh_list, params: {
              id: list.id
            }
          end.to change(ToDoListItem, :count).by 1
          new_list_item = ToDoListItem.last
          expect(new_list_item[:task]).to eq "foo"
          expect(new_list_item[:category]).to eq "foo"
        end
      end
    end
  end
end
