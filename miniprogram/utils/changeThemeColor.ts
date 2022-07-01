export function svgColor(url:string,color='#EBEBEB',type='fill'):string{
	url = decodeURIComponent(url)
  if(url&&url.includes(`<svg style="${type}:`)){
    let colrValue:string = url.split(`<svg style="${type}:`)[1].slice(0,7);
    return encodeURIComponent(url.replace(colrValue, color))
  }
  let svgFile:any = wx.getFileSystemManager().readFileSync(url,'binary');
  return encodeURIComponent(svgFile.replace('<svg', `<svg style="${type}:${color}"`))
}