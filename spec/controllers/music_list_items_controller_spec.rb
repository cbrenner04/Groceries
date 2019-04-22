# frozen_string_literal: true

require "rails_helper"

RSpec.describe MusicListItemsController do
  let(:user) { create :user }
  let(:list) { create :music_list, owner: user }
  let!(:users_list) { create :users_list, user: user, list: list }
  let(:item) { create :music_list_item, music_list: list }

  before { sign_in user }

  describe "GET #edit" do
    describe "format HTML" do
      describe "with read access" do
        before { users_list.update!(permissions: "read") }

        it "redirects to lists_path" do
          get :edit, params: {
            id: item.id,
            list_id: list.id
          }

          expect(response).to redirect_to lists_path
        end
      end

      describe "with write access" do
        before { users_list.update!(permissions: "write") }

        it "renders 'lists/index'" do
          get :edit, params: {
            id: item.id,
            list_id: list.id
          }

          expect(response).to render_template "lists/index"
        end
      end
    end

    describe "format JSON" do
      describe "with read access" do
        before { users_list.update!(permissions: "read") }

        it "redirects to lists_path" do
          get :edit, params: {
            id: item.id,
            list_id: list.id
          }, format: :json

          expect(response).to redirect_to lists_path
        end
      end

      describe "with write access" do
        before { users_list.update!(permissions: "write") }

        it "responds with success and correct payload" do
          get :edit, params: {
            id: item.id,
            list_id: list.id
          }, format: :json

          expect(response).to be_successful
          response_body = JSON.parse(response.body).to_h
          expect(response_body["item"]).to include(
            "archived_at" => item[:archived_at],
            "id" => item[:id],
            "music_list_id" => item[:music_list_id],
            "title" => item[:title],
            "purchased" => item[:purchased],
            "artist" => item[:artist],
            "album" => item[:album],
            "user_id" => item[:user_id]
          )
          expect(response_body["list"]).to include(
            "id" => list[:id],
            "name" => list[:name],
            "archived_at" => list[:archived_at],
            "completed" => list[:completed],
            "refreshed" => list[:refreshed],
            "type" => list[:type]
          )
        end
      end
    end
  end

  describe "POST #create" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        post :create, params: {
          music_list_item: {
            music_list_id: list.id,
            user_id: user.id,
            title: "foo"
          },
          list_id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      describe "with valid params" do
        it "creates a new item" do
          expect do
            post :create, params: {
              music_list_item: {
                music_list_id: list.id,
                user_id: user.id,
                title: "foo"
              },
              list_id: list.id
            }
          end.to change(MusicListItem, :count).by 1
        end
      end

      describe "with invalid params" do
        it "returns 422 and error message" do
          post :create, params: {
            music_list_item: {
              music_list_id: list.id,
              title: nil
            },
            list_id: list.id
          }

          expect(response.status).to eq 422
          expect(response.body).to_not be_blank
        end
      end
    end
  end

  describe "PUT #update" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        update_item = create :music_list_item, title: "foo"
        put :update, params: {
          id: update_item.id,
          music_list_item: { title: "bar" },
          list_id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      describe "with valid data" do
        it "updates a item" do
          update_item = create :music_list_item, title: "foo"
          put :update, params: {
            id: update_item.id,
            music_list_item: { title: "bar" },
            list_id: list.id
          }
          update_item.reload

          expect(update_item.title).to eq "bar"
        end
      end

      describe "with invalid data" do
        it "returns 422 and error message" do
          update_item = create :music_list_item, title: "foo"
          put :update, params: {
            id: update_item.id,
            music_list_item: { title: "", artist: "", album: "" },
            list_id: list.id
          }

          expect(response.status).to eq 422
          expect(response.body).to_not be_blank
        end
      end
    end
  end

  describe "DELETE #destroy" do
    describe "with read access" do
      before { users_list.update!(permissions: "read") }

      it "redirects to lists_path" do
        delete_item = create :music_list_item, title: "foo"
        delete :destroy, params: {
          id: delete_item.id,
          list_id: list.id
        }

        expect(response).to redirect_to lists_path
      end
    end

    describe "with write access" do
      before { users_list.update!(permissions: "write") }

      it "destroys a item" do
        delete_item = create :music_list_item, title: "foo"
        delete :destroy, params: {
          id: delete_item.id,
          list_id: list.id
        }

        expect(MusicListItem.not_archived).to_not include delete_item
      end
    end
  end
end
