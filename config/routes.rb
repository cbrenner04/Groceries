Rails.application.routes.draw do
  devise_for :users
  resources :lists
  resources :items, only: [:new, :create, :edit, :update, :destroy]
  root to: "home#show"
end
