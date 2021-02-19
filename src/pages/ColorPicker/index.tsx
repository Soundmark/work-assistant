import { Col, Input, Row, Form } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Color from 'color';
import './index.scss';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const RGB = 'RGB';
const HSL = 'HSL';
const CMYK = 'CMYK';

function ColorPicker() {
  const [form] = Form.useForm();
  const bar = useRef();
  const picker = useRef();
  const [sliderPos, setSliderPos] = useState(0);
  const [pointerPosX, setPointerPosX] = useState(0);
  const [pointerPosY, setPointerPosY] = useState(0);
  const [canSlide, setCanSlide] = useState(false);
  const [canMovePointer, setCanMovePointer] = useState(false);
  const [curHsl, setCurHsl] = useState([0, 100, 50]);
  const paramConfig = ['#', RGB, HSL, CMYK];

  const setColor = (hsl: number[], type?: string) => {
    window.localStorage.setItem('color', JSON.stringify(hsl));
    const color = Color.hsl(hsl);
    const rgb = color.rgb().array();
    const hex = color.hex();
    const cmyk = color.cmyk().array();
    const fields: any = [
      { name: '#', value: hex.slice(1) },
      type !== 'RGB' && { name: 'R', value: Math.round(rgb[0]) },
      type !== 'RGB' && { name: 'G', value: Math.round(rgb[1]) },
      type !== 'RGB' && { name: 'B', value: Math.round(rgb[2]) },
      type !== 'HSL' && { name: 'H', value: Math.round(hsl[0]) },
      type !== 'HSL' && { name: 'S', value: Math.round(hsl[1]) },
      type !== 'HSL' && { name: 'L', value: Math.round(hsl[2]) },
      type !== 'CMYK' && { name: 'C', value: Math.round(cmyk[0]) },
      type !== 'CMYK' && { name: 'M', value: Math.round(cmyk[1]) },
      type !== 'CMYK' && { name: 'Y', value: Math.round(cmyk[2]) },
      type !== 'CMYK' && { name: 'K', value: Math.round(cmyk[3]) },
    ].filter(Boolean);
    form.setFields(fields);
  };

  const setPos = (hsl: number[]) => {
    const [H, S, L] = hsl;
    const barRect = bar.current.getBoundingClientRect();
    const pickerRect = picker.current.getBoundingClientRect();
    const slidePos = (H * barRect.height) / 360;
    let pointerX;
    let pointerY;
    if (S === 100) {
      if (L > 50) {
        pointerY = 0;
        pointerX =
          2 * pickerRect.width -
          (L * pickerRect.width * pickerRect.height) / 50 / pickerRect.height;
      } else {
        pointerX = pickerRect.width;
        pointerY =
          pickerRect.height -
          (L * pickerRect.width * pickerRect.height) /
            50 /
            (2 * pickerRect.width - pointerX);
      }
    } else if (S === 0) {
      if (L === 0) {
        pointerY = pickerRect.height;
        pointerX = 0;
      } else {
        pointerX = 0;
        pointerY =
          pickerRect.height -
          (L * pickerRect.width * pickerRect.height) /
            50 /
            (2 * pickerRect.width - pointerX);
      }
    } else {
      pointerX = (S * pickerRect.width) / 100;
      pointerY =
        pickerRect.height -
        (L * pickerRect.width * pickerRect.height) /
          50 /
          (2 * pickerRect.width - pointerX);
    }
    setSliderPos(slidePos);
    setPointerPosX(pointerX);
    setPointerPosY(pointerY);
  };

  useMemo(() => {
    // 检查是否有记录的颜色
    const hsl = JSON.parse(window.localStorage.getItem('color') || 'null');
    if (hsl) {
      setCurHsl(hsl);
      setColor(hsl);
    } else {
      // 设置默认颜色
      setColor(curHsl);
    }
  }, []);

  useEffect(() => {
    // console.log(bar);
    // 设置滑块位置
    setPos(curHsl);
  }, []);

  const calColorH = (pos: number, rect: any) => {
    let H = Math.round((360 * pos) / rect.height);
    if (H > 359) H = 0;
    form.setFields([{ name: 'H', value: H }]);
    const { S, L } = form.getFieldsValue();
    const hsl = [H, S, L];
    setColor(hsl);
  };

  // 处理滑块
  const clickBar = (e: any) => {
    const rect = e.target.getBoundingClientRect();
    const pos = e.clientY - rect.top;
    setSliderPos(pos);
    calColorH(pos, rect);
    setCanSlide(true);
  };

  const slideBar = (e: any) => {
    if (!canSlide) return;
    const rect = bar.current.getBoundingClientRect();
    let pos = e.clientY - rect.top;
    if (e.clientY - rect.top < 0) {
      pos = 0;
    } else if (e.clientY - rect.top > rect.height) {
      pos = rect.height;
    }
    setSliderPos(pos);
    calColorH(pos, rect);
  };

  const calColorSL = (x: number, y: number, rect: any) => {
    let S;
    if (y === 0) {
      S = 100;
    } else if (y === rect.height) {
      S = 0;
    } else {
      S = Math.round((100 * x) / rect.width);
    }
    const L = Math.round(
      (50 * (rect.height - y) * (1 + (rect.width - x) / rect.width)) /
        rect.height
    );
    form.setFields([
      { name: 'S', value: S },
      { name: 'L', value: L },
    ]);
    const { H } = form.getFieldsValue();
    const hsl = [H, S, L];
    setColor(hsl);
  };

  // 处理取色区
  const clickPicker = (e: any) => {
    setCanMovePointer(true);
    if (e.target.tagName === 'SPAN') return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointerPosX(x);
    setPointerPosY(y);
    calColorSL(x, y, rect);
  };

  const slidePicker = (e: any) => {
    if (!canMovePointer) return;
    const rect = picker.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (x < 0) {
      x = 0;
    } else if (x > rect.width) {
      x = rect.width;
    }
    if (y < 0) {
      y = 0;
    } else if (y > rect.height) {
      y = rect.height;
    }
    setPointerPosX(x);
    setPointerPosY(y);
    calColorSL(x, y, rect);
  };

  // 处理松开鼠标
  const pageMouseUp = () => {
    setCanSlide(false);
    setCanMovePointer(false);
  };

  // 处理鼠标滑动
  const pageSlide = (e: any) => {
    e.preventDefault();
    slideBar(e);
    slidePicker(e);
  };

  // 计算色块主颜色
  const getPickerColor = (H: number) => {
    const color = Color.hsl([H, 100, 50]);
    return color.hex();
  };

  const onInputChange = (type: string) => {
    if (RGB.includes(type)) {
      console.log('rgb');
      const { R, G, B } = form.getFieldsValue();
      const rgb = [R, G, B].map((item) => parseFloat(item));
      const hsl = Color.rgb(rgb).hsl().array();
      setColor(hsl, RGB);
      setPos(hsl);
    } else if (HSL.includes(type)) {
      console.log('hsl');
      const { H, S, L } = form.getFieldsValue();
      const hsl = [H, S, L].map((item) => parseFloat(item));
      setColor(hsl, HSL);
      setPos(hsl);
    } else if (CMYK.includes(type)) {
      console.log('cmyk');
      const { C, M, Y, K } = form.getFieldsValue();
      const cmyk = [C, M, Y, K].map((item) => parseFloat(item));
      const hsl = Color.cmyk(cmyk).hsl().array();
      setColor(hsl, CMYK);
      setPos(hsl);
    }
  };

  const onInputBlur = (type: string) => {
    if (type === '#') {
      console.log('#');
    }
  };

  return (
    <div
      className="colorpicker"
      onMouseUp={pageMouseUp}
      onMouseMove={pageSlide}
    >
      <Row className="display" />
      <Row className="control" justify="center">
        <Col
          className="picker"
          ref={picker}
          style={{ background: getPickerColor(form.getFieldValue('H')) }}
          onMouseDown={clickPicker}
        >
          <div className="bg1" />
          <div className="bg2" />
          <span
            className="pointer"
            style={{
              left: `${pointerPosX - 7.5}px`,
              top: `${pointerPosY - 7.5}px`,
            }}
          />
        </Col>
        <Col className="slide-bar">
          <div className="bar" ref={bar} onMouseDown={clickBar} />
          <span
            className="slider"
            onMouseDown={() => setCanSlide(true)}
            style={{ top: `${sliderPos - 5}px` }}
          />
        </Col>
        <Col className="preview">
          <div
            className="color"
            style={{ backgroundColor: `#${form.getFieldValue('#')}` }}
          />
          <div className="params">
            <Form form={form} {...layout}>
              {paramConfig.map((item) => (
                <div key={item} className="params-block">
                  {item.split('').map((subItem) => (
                    <Form.Item
                      colon={false}
                      key={subItem}
                      label={subItem}
                      name={subItem}
                    >
                      <Input
                        onChange={() => onInputChange(subItem)}
                        onBlur={() => onInputBlur(subItem)}
                      />
                    </Form.Item>
                  ))}
                </div>
              ))}
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ColorPicker;
