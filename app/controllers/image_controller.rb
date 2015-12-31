class ImageController < ApplicationController
  def index
    render(:layout => false, :template => "/image/index")
  end
  def upload
    img = nil
    params.each do |param|
      if param[1].class == ActionDispatch::Http::UploadedFile then
        img = Image.new
        img.name = param[0]
        image_magick = Magick::Image.from_blob(param[1].read).shift
        tmp = image_magick.resize_to_fit(300, 300)
        akeome = Magick::Image.from_blob(File.read("./public/akeome.png")).shift
        img.data = tmp.composite!(akeome, Magick::SouthWestGravity, Magick::OverCompositeOp).to_blob
        img.save
      end
    end
    if img.nil? then
      render json: {img_name: "error"}
    else
      render json: {id: img.name}
    end
  end


  def show
    img = Image.find_by(name: params[:id])
    send_data(img.data, :disposition => "inline", :type => "image/jpeg")
  end
end
