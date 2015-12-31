class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.binary :data
      t.text :name
      t.timestamps null: false
    end
  end
end
