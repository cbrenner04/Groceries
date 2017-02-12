Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "registrations" }
  resources :lists
  resources :items, only: [:new, :create, :edit, :update, :destroy]
  resources :users_lists, only: [:new, :create]
  root to: "home#show"
end
