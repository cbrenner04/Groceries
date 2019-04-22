# frozen_string_literal: true

require "spec_helper"

RSpec.describe Users::InvitationsController, type: :controller do
  let(:user) { create :user_with_lists }
  let(:list) { user.lists.last }

  before do
    request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in user
  end

  describe "GET #new" do
    it "renders 'lists/index'" do
      get :new

      expect(response).to render_template "lists/index"
    end
  end

  describe "GET #edit" do
    let(:new_user) { User.invite!(email: "test@test.org") }

    before { sign_out user }

    it "renders 'lists/index'" do
      get :edit, params: {
        invitation_token: new_user.raw_invitation_token
      }

      expect(response).to render_template "lists/index"
    end
  end

  describe "POST #create" do
    context "when list_id param exists" do
      context "with valid params" do
        it "creates a new user" do
          expect do
            post :create, params: {
              user: {
                email: "foo@bar.com"
              },
              list_id: list.id
            }
          end.to change(User, :count).by 1
        end

        it "creates a new users_list" do
          expect do
            post :create, params: {
              user: {
                email: "foo@bar.com"
              },
              list_id: list.id
            }
          end.to change(UsersList, :count).by 1
        end
      end

      context "with invalid params" do
        it "re-renders the 'new' template" do
          post :create, params: {
            user: {
              email: nil
            },
            list_id: list.id
          }

          expect(response).to render_template("new")
        end
      end

      describe "when user already exists" do
        let(:other_user) { create :user }

        context "when users_list already exists" do
          before { create :users_list, user: other_user, list: list }

          it "does not create a new users_list" do
            expect do
              post :create, params: {
                user: {
                  email: other_user.email
                },
                list_id: list.id
              }
            end.to_not change(UsersList, :count)
          end

          it "gives correct alert" do
            post :create, params: {
              user: {
                email: other_user.email
              },
              list_id: list.id
            }
            expect(flash[:notice]).to be_present
            expect(flash[:notice])
              .to eq "List already shared with #{other_user.email}"
          end
        end

        context "when users_list does not already exist" do
          it "creates a new users_list" do
            expect do
              post :create, params: {
                user: {
                  email: other_user.email
                },
                list_id: list.id
              }
            end.to change(UsersList, :count).by(1)
          end

          it "gives correct alert" do
            post :create, params: {
              user: {
                email: other_user.email
              },
              list_id: list.id
            }
            expect(flash[:notice]).to be_present
            expect(flash[:notice])
              .to eq "List has been shared with #{other_user.email}"
          end
        end
      end
    end

    context "when list_id param does not exist" do
      context "with valid params" do
        context "when user does not already exist" do
          it "creates a new user" do
            expect do
              post :create, params: {
                user: {
                  email: "foo@bar.com"
                }
              }
            end.to change(User, :count).by 1
          end
        end

        context "when user does already exist" do
          it "redirects to root" do
            user_email = "foo@bar.com"
            User.create!(email: user_email)
            post :create, params: {
              user: {
                email: user_email
              }
            }
            expect(response).to redirect_to root_path
          end
        end
      end

      context "with invalid params" do
        it "re-renders the 'new' template" do
          post :create, params: {
            user: {
              email: nil
            }
          }

          expect(response).to render_template("new")
        end
      end
    end
  end
end
