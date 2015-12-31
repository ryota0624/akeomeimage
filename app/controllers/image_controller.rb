class ImageController < ApplicationController
  def index
    render(:layout => false, :template => "/image/index")
  end
  def upload
    img = nil
    params.each do |param|
      if param[1].class == ActionDispatch::Http::UploadedFile then
        img = EssayImg.new
        img.name = param[0]
        image_magick = Magick::Image.from_blob(param[1].read).shift
        img.data = image_magick.resize_to_fit(300, 300).to_blob
        img.save
      end
    end
    if img.nil? then
      render json: {img_name: "error"}
    else
      render json: {img_name: img.name}
    end
  end


  def show
    img = Image.find_by(name: params[:name])
    send_data(img.data, :disposition => "inline", :type => "image/jpeg")
  end
end
